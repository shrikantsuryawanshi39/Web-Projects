let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);
arr.forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.innerHTML == '=') {
            try {
                string = eval(string);
                input.value = string;
                if (string == undefined) {
                    string = '0';
                    input.value = string;
                }
            } catch (error) {
                // Handle the error here
                console.error('An error occurred during evaluation:', error);
                // Optionally, you can set a default value or handle the error in some other way
                string = '0';
                input.value = string;
            }
        } else if (e.target.innerHTML == 'AC') {
            string = "";
            input.value = string;
        } else if (e.target.innerHTML == 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
        } else {
            string += e.target.innerHTML;
            input.value = string;
        }

    })
})