/**
 * @author ayushi.jain
 * @email ayushi.jain@lighthouseindia.com
 * @create date 2021-07-28 11:12:37
 * @modify date 2021-07-28 11:12:37
 * @desc Sql util for oracle function to its equivalent js function
 */

export class SqlUtil {

    public static round(obj: any,obj1:any) {
        if(obj1==="undefined"|| obj1===null || obj1 === "null" || obj1 ===""){
            return Math.round(obj);
        }else{
            return obj.toFixed(obj1);
        }
  
    }
    public static ceil(obj: any) {
        return Math.ceil(obj);
    }

    public static floor(obj: any) {
        return Math.floor(obj);
    }

    public static trunc(obj: any) {
        return Math.trunc(obj);
    }

    public static cos(obj: any) {
        return Math.cos(obj);
    }

    public static sin(obj: any) {
        return Math.sin(obj);
    }
    public static tan(obj: any) {
        return Math.tan(obj);
    }

    public static sqrt(obj: any) {
        return Math.sqrt(obj);
    }

    public static abs(obj: any) {
        return Math.abs(obj);
    }

    public static power(obj: number,obj1:number) {
        return Math.pow(obj,obj1);
    }
    public static nvl(value1:any,value2:any){
        if (value1 == null)
           return value2;
        
        return value1;
     }

     public static ascii(val:any){
       return val.codePointAt(0);
     }
     
     public static chr(val:any){
     return String.fromCharCode(val);
     }

     public static upper(val:any){
         return val.toUpperCase();
     }

     public static lower(val:any){
        return val.toLowerCase();
    }

    public static  initcap(str:any) {
        str = str.toLowerCase();      
        const arrOfWords = str.split(" ");      
        const arrOfWordsCased = [];
      
        for (let i = 0; i < arrOfWords.length; i++) {
          const char = arrOfWords[i].split("");
          char[0] = char[0].toUpperCase();
      
          arrOfWordsCased.push(char.join(""));
        }
      
        return arrOfWordsCased.join(" ");
      }

      public static ltrim(str:any){
        return str.replace(/^\s+/,"");
      }

      public static rtrim(str:any){
        return str.replace(/\s+$/,"");
      }

      public static trim(str:any){
        return str.trim();
      }
      public static substr(str:any,index:number,len:number){

        return str.substr(index>0?(index-1):index,len);
    }

    public static LENGTH(str:any){
        return str.length;
    }

    public static lpad(str:any,len:number,replaceStr:any){
        if(len<str.length){
            return str.substr(0,len);
        }else{
        return str.padStart(len,replaceStr);
        }
    }

    public static rpad(str:any,len:number,replaceStr:any){
        if(len<str.length){
            return str.substr(0,len);
        }else{
        return str.padEnd(len,replaceStr);
        }
    }

    public static mod(num1:number,num2:number){
        return num1%num2;
    }

    public static remainder(num1:number,num2:number){
        return num1/num2;
    }

    public static exp(num1:number){
        return Math.exp(num1);
    }

    public static decode(str1:any,str2:any,str3:any,str4:any){
        if(str1===str2){
            return str3;
        }else{
            return str4;
        }
    }





    
}