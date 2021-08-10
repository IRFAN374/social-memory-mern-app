import jwt from 'jsonwebtoken';

const SECRET_CODE = 'privateKey';

const auth = async (req,res,next)=>{
    try {
        // console.log("headers",req.headers)
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        
        let decodedData;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token, SECRET_CODE);
            req.userId = decodedData?.id;
        }else{
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;