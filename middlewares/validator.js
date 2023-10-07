const validate = (req, res) => {

    const emailRegEx = /^[A-Za-z0-9]+@gmail.com$/;
    const passRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    const phoneRegEx = /^[6-9]{1}[0-9]{9}$/;

    const { name, email, password, phone } = req.body;
    if (name === "" || email === "" || password === "" || phone === "") {
        return res.status(400).json({ message: "Please enter all the details" })
    } else if(emailRegEx.test(email)){
        return res.status(400).json({message:"Invalid email ID"})
    } else if(passRegEx.test(password)){
        return res.status(400).json({message:"The password must contain atleast an uppercase and a lowercase and a number and a special character"})
    }
}