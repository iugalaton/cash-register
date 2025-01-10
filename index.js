const input = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const cash = document.getElementById("change-due");
const form = document.getElementById("input-form");
const change = document.getElementById("change");
const total = document.getElementById("total");
 

let price = 1.87;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
  ];

total.innerHTML = "$" +price;

class BillType {
    constructor(typeId, name, value){
        this.typeId = typeId;
        this.name = name;
        this.value = value;
    }
}

class Bill {
    constructor(billType, amount){
       this.billType = billType;
       this.amount = amount;
       this.amountReserved = 0;
    }

    calculateValue(){
        return this.amount * this.billType.value;
    }   

    
}

class Change {
    add(bill) {

    }
}

class Cashier {
    constructor(money) {
        this.money = money.sort((billA, billB) => billB.billType.value - billA.billType.value)
    }


    reserveMoneyForChange(change){

        this.money.forEach(bill => bill.amountReserved = 0)

        while (change > 0) {
            let suitableBills = this.money
                .filter(bill => (bill.amount - bill.amountReserved) > 0)
                .filter(bill => bill.billType.value <= change);
            
            if (suitableBills.length == 0) {
                this.money.forEach(bill => bill.amountReserved = 0)
                return false
            }

            change -= suitableBills[0].billType.value;

            suitableBills[0].amountReserved += 1
        }

        return true
    }

    getReservedMoney() {
        const result = []
        this.money
            .filter(bill => bill.amountReserved > 0)
            .forEach(bill => {
                for (let i = 0; i < bill.amountReserved; i++) {
                    result.push(bill.billType)
                }
            })

        return result
    }

    performTransaction(cashFromClient, price) {
        console.log(cashFromClient, price)
        const couldReserve = this.reserveMoneyForChange(cashFromClient - price)
        console.log(couldReserve)

        const reservedMoney = this.getReservedMoney()
        console.log(reservedMoney)

    }
}


const billData = {
    PENNY: {
        name: "Pennies",
        value: 1
    },
    NICKEL: {
        name: "Nickels",
        value: 5
    },
    DIME: {
        name: "Dimes",
        value: 10
    },
    QUARTER: {
        name: "Quarters",
        value: 25
    },
    ONE: {
        name: "Ones",
        value: 100
    },
    FIVE: {
        name: "Fives",
        value: 500
    },
    TEN: {
        name: "Tens",
        value: 1000
    },
    TWENTY: {
        name: "Twenties",
        value: 2000
    },
    'ONE HUNDRED': {
        name: "Hundreds",
        value: 10000
    },
}



const moneyInCashier = cid.map(([typeId, totalCash]) => {
    const billType = new BillType(typeId, billData[typeId].name, billData[typeId].value);
    return new Bill(billType, Math.ceil(totalCash * 100) / billType.value); 
});

const cashier = new Cashier(moneyInCashier);
console.log(cashier)

const showCid = () => {
    const changeInDrawer = moneyInCashier.map((bill) => {
       return `<p>${bill.billType.name}: $${(bill.calculateValue()/100).toFixed(2)}</p>`; 
    }).join("");
    console.log(changeInDrawer);
    change.innerHTML = changeInDrawer;
}


const validation = () => {
    
 const money = Math.floor(input.value * 100);
    if(money < price) {
        alert("Customer does not have enough money to purchase the item");
    }


    cashier.performTransaction(money, Math.floor(price * 100))

}

showCid();
purchaseBtn.addEventListener("click", () => validation());
form.addEventListener("submit", (event) => {
    event.preventDefault();
})