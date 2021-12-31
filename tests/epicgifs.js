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

  await program.rpc.addGif("giphy_link", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF Count', account.totalGifs.toString());

  console.log(' GIF List', account.gifList);

  await program.rpc.updateItem("giphy_link", true, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })
  await program.rpc.updateItem("giphy_link", true, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })
  await program.rpc.updateItem("giphy_link", false, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log(' GIF vote count', account.gifList.filter(g=>g.gifLink==="giphy_link")[0].votes);

  await program.rpc.addGif("giphy_link2", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  await program.rpc.updateItem("giphy_link2", false, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log(' GIF vote count should be negative 1', account.gifList.filter(g=>g.gifLink==="giphy_link2")[0].votes);
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