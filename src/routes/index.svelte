<script>
	let address = 'ADDRESS';
	// function vouch() {
	// 	alert('TODO: Vouch');
	// }
</script>

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
				<button class="btn btn-secondary">ArConnect</button>
				<button class="btn btn-secondary">Aweave.app</button>
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
			<button class="mt-8 btn btn-primary">Tweet</button>
		</div>
	</div>
</div>
<a id="status" />
<div class="hero min-h-screen bg-secondary">
	<div class="hero-content flex-col lg:flex-row">
		<img src="https://placeimg.com/260/400/arch" class="max-w-sm rounded-lg shadow-2xl" />

		<div class="text-primary-content">
			<h1 class="text-5xl font-bold">Status</h1>
			<p class="py-6">
				Step Three: The Vouch DAO service will process your request. It may take a few minutes for
				Vouch DAO to confirm your tweet.
			</p>
			<button class="btn btn-primary">Check Status</button>
		</div>
	</div>
</div>
