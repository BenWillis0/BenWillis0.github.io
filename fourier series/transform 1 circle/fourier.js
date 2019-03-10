function dft(x) {
    const X = [];
    const N = x.length;
    show = x
    for(let k = 0; k < N;k++){
        let re = 0;
        let im = 0;

        for(let n = 0;n < N;n++){
            const phi = (2*Math.PI * k * n) / N; //Angle
            re += x[n][0] * Math.cos(phi) - x[n][1] * Math.sin(phi); //multiplying 2 complex values using:
            im -= x[n][0] * Math.sin(phi) + x[n][1] * Math.cos(phi); //(a,bi) . (c,di) = ac + adi + bci - bd = (ac - bd) + (ad + bc)i 
        }
        re /= N; //Average over the length
        im /= N;

        let freq = k;
        let amp = Math.sqrt(re**2 + im**2);
        let phase = Math.atan2(im, re);

        X[k] = {re, im, freq, amp, phase};
    }
    return X;
}