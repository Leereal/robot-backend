function martingale() {
  let levels = 20;
  let stake = 0.1;
  let payout = 0.95;
  let total = 0;
  for (let current_level = 1; current_level <= levels; current_level++) {
    let totalLastStakes = 0;
    let new_stake = 0;
    for (i = 1; i <= current_level; i++) {
      new_stake = (stake * i * payout + totalLastStakes) / payout;
      totalLastStakes = totalLastStakes + new_stake;
    }
    total = total + new_stake;
    console.log('Martingale Stake: ' + new_stake + ' Total = ' + total);

    //   if (account.currency === 'BTC') {
    //     return new_stake;
    //   }
    // return Math.round(new_stake * 100) / 100;
  }
}

martingale();
