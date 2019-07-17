// init 
const appState = {};
      
      // format total bill with country currency
const formatAsMoney = (amount, buyerCountry) => {
    let code = 'US';
    let currency = 'USD';
        
    countries.filter(results => {
        if (results.country == buyerCountry) {
            code = results.code;
            currency = results.currency;
        }
    });
    let options = { style: 'currency', currency: `${currency}` }
    return amount.toLocaleString(`en-${code}`, options);
};
      
const flagIfInvalid = (field, isValid) => {
    if (isValid) {
        field.classList.remove('is-invalid');
    } else {
        field.classList.add('is-invalid');
    }
        
};
      
const expiryDateFormatIsValid = (target) => {
    const regex = /^[0-9]{2}[\/]{1}[0-9]{2}$/g;
    const dateArr = target.split('/');
    if (regex.test(target) && (dateArr.length == 2)) {
        return true;
    }
    return false;
};
      
const detectCardType = ({ target }) => {
    let cardNum = target.value;
    const cardInd = document.querySelector('[data-credit-card]');
    const cardImage = document.querySelector('[data-card-type]');
    const cardIs = cardNum.split('')[0];
    cardInd.classList.remove('is-visa', 'is-mastercard');
        
    if (cardIs == 4) {
        cardInd.classList.add('is-visa');
        cardInd.classList.remove('is-mastercard');
        cardImage.src = supportedCards.visa;
        return 'is-visa';
    } else if (cardIs == 5) {
        cardInd.classList.add('is-mastercard');
        cardInd.classList.remove('is-visa');
        cardImage.src = supportedCards.mastercard;
        return 'is-mastercard';
    }
};
      
const validateCardExpiryDate = ({ target }) => {
    const month = target.value.split("/")[0];
    const year = target.value.split("/")[1];
    const date = new Date(`${month}/01/${year}`);
    if (expiryDateFormatIsValid(target.value) && date > new Date()) {
        flagIfInvalid(target, true);
        return true;
    } else {
        flagIfInvalid(target, false);
        return false;
    }
};
      
const validateCardHolderName = ({ target }) => {
    const nameSplit = target.value.split(' ');
    if (nameSplit.length != 2) {
        flagIfInvalid(target, false);
        return false;
    }
    if (nameSplit[0].length >= 3 && (nameSplit[1].length >= 3)) {
        flagIfInvalid(target, true);
        return true;
    }
        
};
      
const validateWithLuhn = (digits) => {
    digits.join('');
    const regExp = /[^0-9-\s]+/;
        
    if (regExp.test(digits)) {
        if (digits.length != 16 || digits.length == 0) {
            return false;
        }
    }
       
    let xCheck = 0,
        aEven = false;
    digits = digits.toString().replace(/\D/g, "");
        
    for (let i = digits.length - 1; i >= 0; i--) {
        let cDigit = digits.charAt(i),
            nDigit = parseInt(cDigit, 10);
        if (aEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
        }
        xCheck += nDigit;
        aEven = !aEven;
    }
    return (xCheck !== 0) && (xCheck % 10) == 0 ? true : false;
};
      
const validateCardNumber = () => {
    const ccInput = document.querySelectorAll('div[data-cc-digits] input');
    const ccInputValue = [];
    let ccDigit;
    ccInput.forEach(input => {
        ccDigit = input.value.split('');
        ccInputValue.push(...ccDigit);
    });
        
    let isValid = validateWithLuhn(ccInputValue);
        
    if (isValid) {
        document.querySelector('[data-cc-digits]').classList.remove('is-invalid');
    } else {
        document.querySelector('[data-cc-digits]').classList.add('is-invalid');
    }
        
    return isValid;
};
      
const uiCanInteract = () => {
    const cardInput1 = document.querySelector('div[data-cc-digits] input');
    const holderNameInput = document.querySelector('div[data-cc-info] input');
    const cardDate = document.querySelectorAll('div[data-cc-info] input')[1];
    const button = document.querySelector('[data-pay-btn]');
    cardInput1.addEventListener('blur', detectCardType);
    holderNameInput.addEventListener('blur', validateCardHolderName);
    cardDate.addEventListener('blur', validateCardExpiryDate);
    button.addEventListener('click', validateCardNumber);
    cardInput1.focus();
        
};
      
const displayCartTotal = ({ results }) => {
    const [data] = results;
    const { itemsInCart, buyerCountry } = data;
        
    appState.items = itemsInCart;
    appState.country = buyerCountry;
       
    appState.bill = itemsInCart.reduce((total, itemsInCart) => {
        return total + (itemsInCart.price * itemsInCart.qty)
    }, 0);
    appState.billFormatted = formatAsMoney(appState.bill, appState.country);
        
    document.querySelector('span[data-bill]').textContent = appState.billFormatted
    uiCanInteract();
};
      
      const fetchBill = () => {
        const api = 'https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c';
        fetch(api).then(response => response.json())
          .then(data => displayCartTotal(data))
          .catch(err => console.log(err));
      }
      
      const supportedCards = {
        visa, mastercard
      };
      
const countries = [
    {
        code: "US",
        currency: "USD",
        country: 'United States'
    },
    {
        code: "NG",
        currency: "NGN",
        country: 'Nigeria'
    },
    {
        code: 'KE',
        currency: 'KES',
        country: 'Kenya'
    },
    {
        code: 'UG',
        currency: 'UGX',
        country: 'Uganda'
    },
    {
        code: 'RW',
        currency: 'RWF',
        country: 'Rwanda'
    },
    {
        code: 'TZ',
        currency: 'TZS',
        country: 'Tanzania'
    },
    {
        code: 'ZA',
        currency: 'ZAR',
        country: 'South Africa'
    },
    {
        code: 'CM',
        currency: 'XAF',
        country: 'Cameroon'
    },
    {
        code: 'GH',
        currency: 'GHS',
        country: 'Ghana'
    }
];
      
const startApp = () => {
    fetchBill();
};

startApp();