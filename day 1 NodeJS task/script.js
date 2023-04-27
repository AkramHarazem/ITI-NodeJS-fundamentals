const express = require('express');
const app = express();
app.get('/:op/*', (req, res) => {
    // console.log(req.url); 
    // console.log((req.url).split('/'));
    console.log(req.params);  
    // console.log(req.params[0].split('/'));
    let oper = req.params.op;
    let operLow = oper.toLowerCase()
    let nums = req.params[0].split('/').map(num => parseInt(num))
    console.log(nums);
    const regex = /^[0-9]+$/;
    for (let num of nums) {
        if (!regex.test(num)) {
            res.send('Invalid input. Please enter numbers only.');
        }
    }

    if (operLow === 'add') {
        let sum = nums.reduce((total, num) => {
            return total + num
        })
        // let sum =0 ;
        // nums.forEach(elem => {
        //     sum += elem
        // })
        res.send('your sum is ' + sum.toString())
    } else if (operLow === 'mult') {
        let mult = nums.reduce((total, num) => {
            return total * num
        })
        res.send('your multiplication is ' + mult.toString())
    } else if (operLow === 'divid') {
        if (nums.includes(0) && nums[0]) {
            res.send('can not divid by Zero')
        } else {
            let divid = nums.reduce((total, num) => {
                return total / num
            })
            res.send('your division is ' + divid.toString())
        }

    } else if (operLow === 'sub') {
        let sub = nums.reduce((total, num) => {
            return total - num
        })
        res.send('your subtraction is ' + sub.toString())
    } else {
        res.send('your operation input is not included')
    }
});
app.listen('8080', () => {
    console.log('http://localhost:8080');
});