const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log(" Starting test...")

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Epicgifs;

  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.startStuffOff({
    accounts:{
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log(" Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF Count', account.totalGifs.toString());

  const giphy1 = "https://giphy.com/somegif"
  const giphy2 = "https://giphy.com/somegif2"

  await program.rpc.addGif(giphy1, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF Count', account.totalGifs.toString());

  console.log(' GIF List', account.gifList);

  await program.rpc.updateItem(giphy1, true, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })
  await program.rpc.updateItem(giphy1, true, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })
  await program.rpc.updateItem(giphy1, false, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log(' GIF vote count', account.gifList.filter(g=>g.gifLink===giphy1)[0].votes);

  await program.rpc.addGif(giphy2, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  await program.rpc.updateItem(giphy2, false, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log(' GIF vote count should be negative 1', account.gifList.filter(g=>g.gifLink===giphy2)[0].votes);
}

const runMain = async () => {
  try{
    await main();
    process.exit(0);
  }catch (error){
    console.error(error);
    process.exit(1);
  }
}

runMain();