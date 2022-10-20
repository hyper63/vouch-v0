<script>
	import { ArweaveWebWallet } from 'arweave-wallet-connector';
	import Arweave from 'arweave';
	import Modal from '$lib/components/modal.svelte';
	import service from '$lib/store.js';

	const arweave = Arweave.init({
		host: 'arweave.net',
		port: 443,
		protocol: 'https'
	});
	const send = $service.send;

	//let address = 'ADDRESS';
	$: address = $service.context.address;
	$: current = $service.machine.current;

	let submitting = false;

	function getStarted() {
		if (current === 'welcome') {
			document.getElementById('connect').scrollIntoView();
		} else if (current === 'connected') {
			document.getElementById('tweet').scrollIntoView();
		} else {
			document.getElementById('status').scrollIntoView();
		}
	}

	async function arconnect() {
		if (!window.arweaveWallet) {
			window.open('https://arconnect.io', '_blank');
		}
		await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION'], {
			name: 'Vouch DAO v0'
		});
		address = await arweaveWallet.getActiveAddress();
		send({ type: 'connect', value: address });
		document.getElementById('tweet').scrollIntoView();
	}

	async function appconnect() {
		const wallet = new ArweaveWebWallet({
			name: 'Vouch Twitter v0'
		});

		wallet.setUrl('arweave.app');
		await wallet.connect();
		address = await arweaveWallet.getActiveAddress();
		send({ type: 'connect', value: address });
		document.getElementById('tweet').scrollIntoView();
	}

	const tweetHREF = (addr) => {
		const text = encodeURI(`I am vouching for my wallet address ${addr}  🐘 via @vouchdao!`);
		return `https://twitter.com/intent/tweet?text=${text}`;
	};

	function tweet() {
		send('tweet');
		document.getElementById('status').scrollIntoView();
	}

	async function checkStatus() {
		if (current === 'tweeted') {
			submitting = true;
			const key = await arweave.wallets.generate();
			const data = Arweave.utils.stringToBuffer(
				JSON.stringify({
					address,
					service: 'twitter',
					type: 'vouch'
				})
			);
			const signature = await Arweave.crypto.sign(key, data);
			const payload = {
				data: Arweave.utils.bufferTob64Url(data),
				publicKey: key.n,
				signature: Arweave.utils.bufferTob64Url(signature)
			};

			const result = await fetch('/vouch.json', {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => (res.ok ? res.json() : res.text()));

			submitting = false;

			if (result.ok) {
				send('submitSuccess');
			} else {
				send('submitFailure');
			}
		}
	}
</script>

<!--
<svelte:head>
	<script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>
-->
<div class="sticky top-0 flex justify-end">
	<div class="px-16 py-4">
		<span class="mr-16">{address}</span>
		{#if current !== 'welcome'}
			<div class="btn btn-secondary">Connected</div>
		{:else}
			<a href="#connect" class="btn btn-primary">Not Connected</a>
		{/if}
	</div>
</div>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center text-primary-content">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Vouch Twitter v0</h1>
			<p class="py-6">
				Vouch Twitter Service is a registered server of <a
					class="link"
					href="https://www.vouchdao.xyz/">Vouch DAO</a
				>, this server allows users to leverage the power of twitter to create a Vouch Record for
				Web of Value Services.
			</p>

			<div class="mt-32 flex justify-center space-x-4">
				<button on:click={getStarted} class="btn btn-primary">Get Started</button>
				<a href="https://vouchdao.xyz" target="_blank" class="btn btn-secondary">Learn More</a>
			</div>
		</div>
	</div>
</div>
<a id="connect" />
<div class="hero min-h-screen bg-primary">
	<div class="hero-content flex-col lg:flex-row">
		<!--
		<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
		-->
		<div class="text-primary-content">
			<h1 class="text-5xl font-bold">Step One: Connect</h1>
			<p class="py-6">You need to connect your Arweave Wallet. Choose the Wallet you use.</p>
			<div>
				<button disabled={current !== 'welcome'} class="btn btn-secondary" on:click={arconnect}
					>ArConnect</button
				>
				<button disabled={current !== 'welcome'} class="btn btn-secondary" on:click={appconnect}
					>Arweave.app</button
				>
			</div>
			<div class="mt-32 prose lg:prose-xl">
				<blockquote>
					Need a Wallet? You can install <a href="https://arconnect.io">ArConnect</a> or
					<a href="https://arweave.app">Arweave.app</a>.
				</blockquote>
			</div>
		</div>
	</div>
</div>
<a id="tweet" />
<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<!--
		<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
		-->
		<div>
			<h1 class="text-5xl font-bold">Step Two: Tweet</h1>
			<p class="py-6">Tweet a vouch message!</p>
			<div class="mockup-code text-primary-content">
				<pre><code>I am vouching for my wallet address {address}  🐘 via @vouchdao!</code></pre>
			</div>
			{#if current === 'connected'}
				<a
					target="_blank"
					href={tweetHREF(address)}
					on:click={tweet}
					class="mt-8 btn btn-info no-underline">Tweet</a
				>
			{:else}
				<a
					disabled={true}
					target="_blank"
					href={tweetHREF(address)}
					on:click={tweet}
					class="mt-8 btn btn-info no-underline">Tweet</a
				>
			{/if}
			<div class="mt-8 alert alert-info">
				When you click the "Tweet" button, this app will open up a new tab in which you will need to
				login and tweet the filled in tweet.
			</div>
		</div>
	</div>
</div>
<a id="status" />
{#if current === 'success'}
	<div class="hero min-h-screen bg-success">
		<div class="hero-content flex-col lg:flex-row">
			<!--
			<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
			-->
			<div class="text-primary-content">
				<h1 class="text-5xl font-bold">Success!</h1>
				<p class="py-6">Your wallet has been verified using Vouch Twitter</p>
			</div>
		</div>
	</div>
{:else if current === 'failure'}
	<div class="hero min-h-screen bg-error">
		<div class="hero-content flex-col lg:flex-row">
			<!--
			<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
			-->
			<div class="text-primary-content">
				<h1 class="text-5xl font-bold">Error!</h1>
				<p class="py-6">Your wallet could not be verified using Vouch Twitter</p>
				<p class="py-6">
					For support, please go to <a class="link" href="https://discord.gg/jRTnwdrxg5"
						>Permapages Discord</a
					>
					and enter your issue in the #help channel
				</p>
			</div>
		</div>
	</div>
{:else}
	<div class="hero min-h-screen bg-secondary">
		<div class="hero-content flex-col lg:flex-row">
			<!--
			<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
			-->
			<div class="text-primary-content">
				<h1 class="text-5xl font-bold">Step Three: Vouch</h1>
				<p class="py-6">
					The Vouch Twitter service will process your request. It may take a few minutes for Vouch
					Twitter to confirm your tweet.
				</p>
				<button class="btn btn-primary" on:click={checkStatus}>Submit</button>
			</div>
		</div>
	</div>
{/if}
<Modal open={submitting} ok={false}>
	<h3>Submitting Vouch Request...</h3>
</Modal>
