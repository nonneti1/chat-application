const users = [];
const userRegex = /^[\dA-Za-z.\s_-]+$/g;
export const UserController = {
    users_sign_up(req,res,next){
        const data = req.body;
        if(users.find(user=> user.username === data.username) === undefined && userRegex.test(data.username)){
            data.id=Date.now();
            users.push(data);
            console.log(users);
            return res.status(200).json({
                message:"User created!"
            })
        }else{
            return res.status(422).json({
                message:"User already existed or Invalid Input!"
            })
        }
    },
    users_log_in(req,res,next){
        const data = req.body;
        const checkUser = users.findIndex(user=>user.username === data.username);
        console.log(data);
        if(checkUser >= 0){
             if(users[checkUser].password === data.password){
                 return res.status(200).json({
                     message:"Passed",
                     data:users[checkUser]
                 })
             }else{
                return res.status(401).json({
                    message:"Invalid credentials"
                })
             }
        }else{
            return res.status(401).json({
                message:"Invalid credentials"
            })
        }
    },
    users_get_user(req,res){
        console.log('Sending data...');
        console.log(users);
        return res.status(200).json(users);
    }
}

export default users;