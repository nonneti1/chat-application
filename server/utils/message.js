import moment from "moment";

export function formatMessage(username,text){
    return{
        username,
        text,
        time:moment().format('LT')
    }
}