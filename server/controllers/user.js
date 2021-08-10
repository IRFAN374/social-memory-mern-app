import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'

const SECRET_CODE = 'privateKey';


// for vallifation import joi 

export const signin = async(req,res)=>{
    const {email,password} = req.body;
    try {
        // check user is exist or not
        const existUser = await User.findOne({email});
        if(!existUser){ return res.status(404).json({ message:"User Does not exist" }) }
        // end of checking user

        // start of passsword checking
        const isPasswordCorrect = await bcrypt.compare(password,existUser.password);
        if(!isPasswordCorrect){ return res.status(400).json({ messgae: "Invalid user Login or password" }) } 
        //end of password checking

        // generate token 
          const token = jwt.sign( { email: existUser.email, id: existUser._id }, SECRET_CODE, { expiresIn: '1h'} )
        // end of token

        // send token
        res.status(200).json({ result: existUser, token })

    } catch (error) {
        return res.status(500).json({ message:'Something went wrong,try again later', error: error.message })
    }   
};


export const signup = async(req,res)=>{
    const { email, password,confirmPassword, firstName, lastName } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) return res.status(400).json({ message: "User already exists" });

       if(password !== confirmPassword){
        //    console.log("I am from confirm password",password);
        //    console.log("confirmPassword",confirmPassword);
            return res.status(400).json({ message: "Password does not matched" }) }
       
    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
    //         // Store hash in your password DB.
    //     });
    // });
        const salt =await bcrypt.genSalt(10);
       // console.log("after gen",salt,"----",password)
        const hashedPassword =await bcrypt.hash(password,salt);
      //  console.log("after hash",hashedPassword)
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    //    console.log("after result")
        const token = jwt.sign( { email: result.email, id: result._id }, SECRET_CODE, { expiresIn: "1h" } );
       // console.log("after token")
        res.status(201).json({ result, token });
    } catch (error) {
        console.log("welcome to error");
       res.status(500).json({ message: "Something went wrong" }); 
        console.log(error); 
    }
};