<script>
	import Arweave from 'arweave';
	const arweave = Arweave.init({
		host: 'arweave.net',
		port: 443,
		protocol: 'https'
	});

	let address = '';

	async function vouch() {
		if (!window.arweaveWallet) {
			alert('admin wallet required');
			return;
		}
		await window.arweaveWallet.connect(['SIGN_TRANSACTION'], { name: 'vouch-twitter' });
		let tx = await arweave.createTransaction({
			data: JSON.stringify({
				address,
				service: 'twitter',
				type: 'vouch'
			})
		});
		await arweave.transactions.sign(tx);

		const result = await fetch('/admin.json', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(tx)
		});
		if (result.ok) {
			address = '';
			alert('Verified User!');
		} else {
			address = '';
			alert('Could not verify user!');
		}
	}
</script>

<main class="hero min-h-screen">
	<section class="hero-content flex-col">
		<div class="form-control w-[600px]">
			<label class="label">Address</label>
			<input type="text" class="input input-bordered" bind:value={address} />
		</div>
		<div class="my-8">
			<button class="btn" on:click={vouch}>Submit</button>
		</div>
	</section>
</main>
