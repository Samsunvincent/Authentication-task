const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

if (registerLink) {
    registerLink.onclick = () => {
        wrapper.classList.add('active');
    };
}

if (loginLink) {
    loginLink.onclick = () => {
        wrapper.classList.remove('active');
    };
}


// --------otp section------
$(".otp-inputbar").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        $("#errmsg").html("Digits Only").show().fadeOut("slow");
        return false;
    }
});
$(".otp-inputbar").on("keyup keydown keypress", function (e) {
    if ($(this).val()) {
        $(this).next().focus();
    }
    var KeyID = e.keyCode;
    switch (KeyID) {
        case 8:
            $(this).val("");
            $(this).prev().focus();
            break;
        case 46:
            $(this).val("");
            $(this).prev().focus();
            break;
        default:
            break;
    }
});



async function signup(event) {
    event.preventDefault()
    let name = document.getElementById('name').value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let data = {
        name,
        email,
        password,
    };
    console.log("data", data);

    let strdata = JSON.stringify(data);

    try {
        let response = await fetch(`/adduser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: strdata
        });
        console.log("response", response);

        if (response.status === 200) {
            alert("User creation successfull , check the email for otp to verify")
            window.location = `email-verify.html`

        }
        else {
            alert("user creatio failed")
        }
    } catch (error) {
        console.log("error", error);

    }


}

async function otp_verification(event) {

    event.preventDefault()

    let email = document.getElementById('email').value;
    let input1 = document.getElementById('input1').value
    let input2 = document.getElementById('input2').value
    let input3 = document.getElementById('input3').value
    let input4 = document.getElementById('input4').value
    let input5 = document.getElementById('input5').value
    let input6 = document.getElementById('input6').value

    let otp = `${input1}${input2}${input3}${input4}${input5}${input6}`;

    if (otp.length !== 6) {
        alert("Please enter a 6-digit OTP.");
        return;
    }

    if (!/^\d{6}$/.test(otp)) {
        alert("OTP should only contain digits.");
        return;
    }


    let data = {
        email,
        otp


    };
    console.log("data", data);

    let strdata = JSON.stringify(data);
    console.log("strdata", strdata);

    try {
        let response = await fetch('/verify_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: strdata
        });
        console.log("response", response);

        
        
        
        let parsed_Response = await response.json();
        console.log('parsed_Response', parsed_Response);
        
        if(response.status === 200){
            alert('otp verified succesfully');
            window.location = ``
        }
        else if(parsed_Response.message === 'Invalid OTP'){
            alert('Invalid otp');
        }
        else if(parsed_Response.message === 'user not found'){
            alert("user not found");
        }
        else{
            alert('something went wrong');
        }
      

        let data = parsed_Response.data;
        console.log("data", data);

      


    } catch (error) {
        console.log("error", error);
    }
}

async function login(event){

    event.preventDefault()

    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value

    let data = {
        email,
        password
    }

    let strdata = JSON.stringify(data);
    console.log('data',strdata);

    try {
        let response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : strdata
        });
        console.log("response",response);

        let parsed_Response = await response.json();
        console.log("parsed response",parsed_Response);

        let data = parsed_Response.data;
        console.log("data",data);

        let token = data.token;
        console.log("token : ",token);

        let id = data._id
        console.log("id",id);

        let token_key = id

        localStorage.setItem(token_key,token);


        if(response.status === 200){
            alert("user login successfull");
            window.location = `user.html?id=${id}&login=${token_key}`
        }
    } catch (error) {
        console.log("error",error)
    }
}

async function userProfile(){
    let params = new URLSearchParams(window.location.search);

    let id = params.get('id');
    let token_key = params.get('login')

    let token = localStorage.getItem(token_key);
    console.log("token",token);

    try {
        let response = await fetch(`/getuser/${id}`,{
            method : "GET",
            headers : {
                'Authorization' : `Bearer ${token}`,
            },

        });
        console.log('response',response);

        let parsed_Response = await response.json();
        console.log("parsed_response",parsed_Response);

        let data = parsed_Response.data;
        console.log('data',data);

        let user_container = document.getElementById('user_Container')

        let singleUser = `

        <div>Name :${data.name}</div>
        <div>Email: ${data.email}</div>
     
     


        `

        user_container.innerHTML = singleUser
    } catch (error) {
        console.log("error",error);

    }
}