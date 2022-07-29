<script>
	import { ArweaveWebWallet } from 'arweave-wallet-connector';
	import Arweave from 'arweave';

	const arweave = Arweave.init({
		host: 'arweave.net',
		port: 443,
		protocol: 'https'
	});

	let address = 'ADDRESS';
	let connected = false;
	let tweeted = false;
	let success = false;

	async function arconnect() {
		if (!window.arweaveWallet) {
			window.open('https://arconnect.io', '_blank');
		}
		await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION'], {
			name: 'Vouch DAO v0'
		});
		address = await arweaveWallet.getActiveAddress();
		connected = true;
		document.getElementById('tweet').scrollIntoView();
	}

	async function appconnect() {
		const wallet = new ArweaveWebWallet({
			name: 'Vouch DAO v0'
		});

		wallet.setUrl('arweave.app');
		await wallet.connect();
		address = await arweaveWallet.getActiveAddress();
		connected = true;
		document.getElementById('tweet').scrollIntoView();
	}

	// window.addEventListener('arweaveWalletLoaded', () => {
	// 	/** Handle ArConnect load event **/
	// 	console.log('arweaveWallet loaded');
	// });

	const tweetHREF = (addr) => {
		const text = encodeURI(`I am vouching for my wallet address ${addr}  🐘 via twitter!`);
		return `https://twitter.com/intent/tweet?text=${text}`;
	};

	function tweet() {
		tweeted = true;
		document.getElementById('status').scrollIntoView();
	}

	async function checkStatus() {
		//if (connected && tweeted && address !== 'ADDRESS') {
		// create and sign transaction, then post to /vouch
		const tx = await arweave.createTransaction({
			data: JSON.stringify({
				address,
				service: 'twitter',
				type: 'vouch'
			})
		});
		await arweave.transactions.sign(tx);
		const result = await fetch('/vouch.json', {
			method: 'POST',
			body: JSON.stringify(tx),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => (res.ok ? res.json() : res.text()));
		if (result.ok) {
			success = true;
		}
		//console.log(result);
		//}
	}
</script>

<!--
<svelte:head>
	<script async defer src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>
-->
<div class="sticky top-0 flex justify-end">
	<div class="px-16 py-4">
		{#if connected}
			<div class="btn btn-secondary">Connected</div>
		{:else}
			<a href="#connect" class="btn btn-primary">Not Connected</a>
		{/if}
	</div>
</div>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center text-primary-content">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Vouch DAO v0</h1>
			<p class="py-6">
				Identity management in Web3 is a big deal, how can permissionless networks prevent against
				Sybil attacks without users having to provide decentrailized applications proof of identity?
			</p>
			<p>
				With Vouch DAO, you can choose from a selection of Vouch Services to create a vouch contract
				that informs dApps that your wallet is a real user! But you don't have to give these
				services or dApps any information about yourself that you don't want to just to verify you
				are a user.
			</p>
			<div class="mt-32 flex justify-center space-x-4">
				<a href="#connect" class="btn btn-primary">Get Started</a>
				<a href="/learn" class="btn btn-secondary">Learn More</a>
			</div>
		</div>
	</div>
</div>
<a id="connect" />
<div class="hero min-h-screen bg-primary">
	<div class="hero-content flex-col lg:flex-row">
		<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />

		<div class="text-primary-content">
			<h1 class="text-5xl font-bold">Connect</h1>
			<p class="py-6">
				Step One: You need to connect your Arweave Wallet. Choose the Wallet you use.
			</p>
			<div>
				<button class="btn btn-secondary" on:click={arconnect}>ArConnect</button>
				<button class="btn btn-secondary" on:click={appconnect}>Aweave.app</button>
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
		<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />
		<div>
			<h1 class="text-5xl font-bold">Tweet</h1>
			<p class="py-6">Step Two: Tweet a vouch message!</p>
			<div class="mockup-code text-primary-content">
				<pre><code>I am vouching for my wallet address {address}  🐘 via twitter!</code></pre>
			</div>
			<a
				target="_blank"
				href={tweetHREF(address)}
				on:click={tweet}
				class="btn btn-info no-underline">Tweet</a
			>
		</div>
	</div>
</div>
<a id="status" />
{#if success}
	<div class="hero min-h-screen bg-success">
		<div class="hero-content flex-col lg:flex-row">
			<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />

			<div class="text-primary-content">
				<h1 class="text-5xl font-bold">Success!</h1>
				<p class="py-6">Your wallet has been verified using Vouch DAO</p>
			</div>
		</div>
	</div>
{:else}
	<div class="hero min-h-screen bg-secondary">
		<div class="hero-content flex-col lg:flex-row">
			<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />

			<div class="text-primary-content">
				<h1 class="text-5xl font-bold">Status</h1>
				<p class="py-6">
					Step Three: The Vouch DAO service will process your request. It may take a few minutes for
					Vouch DAO to confirm your tweet.
				</p>
				<button class="btn btn-primary" on:click={checkStatus}>Check Status</button>
			</div>
		</div>
	</div>
{/if}
