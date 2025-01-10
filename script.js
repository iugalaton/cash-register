const input = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeLocation = document.getElementById("change-due");
const form = document.getElementById("input-form");
const cashier = document.getElementById("change");
const total = document.getElementById("total");


let price = 1.87;
let cid = [
    ['PENNY', 0.5],
    ['NICKEL', 0],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

total.innerHTML = "$" + price;






class MonetaryUnit {
    type;
    name;
    unit;
    static MoneyTypes = {
        "PENNY": {
            name: "Pennies",
            unit: 1
        },
        "NICKEL": {
            name: "Nickels",
            unit: 5
        },
        "DIME": {
            name: "Dimes",
            unit: 10
        },
        "QUARTER": {
            name: "Quarters",
            unit: 25
        },
        "ONE": {
            name: "Ones",
            unit: 100
        },
        "FIVE": {
            name: "Fives",
            unit: 500
        },
        "TEN": {
            name: "Tens",
            unit: 1000
        },

        "TWENTY": {
            name: "Twenties",
            unit: 2000
        },

        "ONE HUNDRED": {
            name: "Hundreds",
            unit: 10000
        },
    }
    constructor(type) {
        this.type = type;
        this.name = MonetaryUnit.MoneyTypes[type].name;
        this.unit = MonetaryUnit.MoneyTypes[type].unit;

    }

}

class CashierDivider {
    monetaryUnit;
    amount;
    constructor(dividerType, amount) {
        this.monetaryUnit = new MonetaryUnit(dividerType);
        this.amount = Math.ceil(amount * 100) / this.monetaryUnit.unit;
    }
    get dividerSum() {
        return this.amount * this.monetaryUnit.unit
    }
}

class Cashier {
    cashierDividers = [];
    setupCashier(cashInCashier) {
        this.cashierDividers = cashInCashier.map(element => new CashierDivider(element[0], element[1]));
        this.cashierDividers.sort((a, b) => b.monetaryUnit.unit - a.monetaryUnit.unit);
    }



    calculateChange(change) {
        const dividersToTakeMoneyFrom = [];

        const restOfChangeReduce = this.cashierDividers
            .filter(divider => divider.monetaryUnit.unit <= change && divider.amount > 0)
            .reduce((acc, divider) => {
                console.log(divider);
                let times = 0;
                for (let i = 0; i < divider.amount; i++) {

                    if (acc >= divider.monetaryUnit.unit) {

                        console.log(acc);
                        acc -= divider.monetaryUnit.unit;
                        times++;


                    }


                }

                if (times > 0) {
                    dividersToTakeMoneyFrom.push({
                        divider: divider,
                        amount: times
                    });
                }

                return acc

            }, change)

        if (restOfChangeReduce != 0) {
            return false;
        }
        console.log(dividersToTakeMoneyFrom);
        return dividersToTakeMoneyFrom;

    }

    removeChange(changeToGive) {
        changeToGive.forEach(({divider, amount}) => {
            divider.amount -= amount;
        })
    }
}


//new MonetaryUnit();

const myCashier = new Cashier();
myCashier.setupCashier(cid);
console.log(myCashier);

const showCid = () => {
    const changeInDrawer = myCashier.cashierDividers.toReversed().map((divider) => {
        return `<p>${divider.monetaryUnit.name}: $${(divider.dividerSum / 100).toFixed(2)}</p>`;
    }).join("");
    console.log(changeInDrawer);
    cashier.innerHTML = changeInDrawer;
}

const showChangeToGive = (changeToGive) => {

       const info =  changeToGive.map(({divider, amount}) => {
       console.log(divider, amount);
       return `<p>${divider.monetaryUnit.type}: $${(amount * divider.monetaryUnit.unit / 100).toFixed(2)}</p>`;
    
    }).join("");
     changeLocation.innerHTML = info;
}





const validation = () => {

    const money = Math.floor(input.value * 100);
    const change = money - Math.floor(price * 100);

    if (money < Math.floor(price * 100)) {
        alert("Customer does not have enough money to purchase the item");
    }
    if (money === Math.floor(price * 100)) {
        const changeInDrawer = `<p> No change due - customer paid with exact cash</p>`
        changeLocation.innerHTML = changeInDrawer;
    }


    //  cashier.performTransaction(money, Math.floor(price * 100))
    const changeToGive = myCashier.calculateChange(change);
    showChangeToGive(changeToGive);
    myCashier.removeChange(changeToGive);
    showCid();


}

showCid();

purchaseBtn.addEventListener("click", () => validation());

form.addEventListener("submit", (event) => {
    event.preventDefault();
})