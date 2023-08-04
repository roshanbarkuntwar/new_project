
/**
 * @author ayushi.jain
 * @email ayushi.jain@lighthouseindia.com
 * @create date 2021-07-31 12:14:48
 * @modify date 2021-07-31 12:14:48
 * @desc Conversion of plsql block to type script
 */
 export class LhsPlSQLToJS {
     
    /** Please do not change the sequence of any if statement */
    static xyz: any;
    public static getConvertedScript(plsqlData:any){
        var quotedStr = plsqlData.match(/'(?:(?:\\'|[^'])*)'/g);
     
        var data = plsqlData.toUpperCase();
        
        data = data.replace(/\s+/g, ' ');
        data = data.replace(/\s+;/g, ';');
      // alert("data==>"+data);
        var forline = data.match(/FOR (.*?) LOOP/g);
      //  alert(forline);
        
        if (data.includes("DECLARE") ) {
            data = data.replaceAll("DECLARE", "");

            var subString = data.substring(data.indexOf("DECLARE"), data.indexOf("BEGIN")).trim();
          // console.log("subString.." + subString);
            var d = "";
            if (subString.includes(";")) {
                var arr1 = subString.split(";");
                console.log("arr1=="+arr1);
                for (var i = 0; i < arr1.length; i++) {
                    
                    if(arr1[i]!==""){
                        //console.log("i--"+i);
                        if(arr1[i].includes(":=")){
                            arr1[i]=  arr1[i].replaceAll(":="," := "); 
                        }
                    var ab = arr1[i].trim().split(" ");
                  //  console.log("ab:="+ab);
                    let indexOf = ab.indexOf(":=");
                   
                    if (indexOf > -1) {
                        let s = "";
                        for (let k = indexOf+1; k < ab.length; k++) {
                            s += ab[k];
                           // console.log("log--"+s);
                        }
                        d = d + "var " + arr1[i].trim().split(" ")[0] + "@assign@" + s + ";\n";
                     //   console.log("assd---"+d);
                    } else {

                        d += "var " + arr1[i].trim().split(" ")[0] + "; \n";
                      //  console.log("vard---"+d);
                    }
                }
                }

              // console.log("d.." + d);
            }
            data = d + data.substring(data.indexOf("BEGIN")+5);

          

        }
        if (data.includes(":=")) {
            data = data.replaceAll(":=", "@assign@");
        }
       
        if (data.includes("=")) {
            data = data.replaceAll("=", "==");
        }
        //////////alert("data3(=)==>"+data)
        if (data.includes("THEN")) {
            data = data.replaceAll("THEN", ") {");
        }
        //////////alert("data3(then)==>"+data)
        if (data.includes("END IF")) {
            data = data.replaceAll("END IF;", "}");
        }
        //////////alert("data3(END IF)==>"+data)
        if (data.includes("ELSEIF")) {
            data = data.replaceAll("ELSEIF", " } else if (");
        }
        //////////alert("data3(ELSEIF)==>"+data)
        if (data.includes("IF")) {
            data = data.replaceAll("IF", "if (");
        }
        //////////alert("data3(if)==>"+data)
        if (data.includes("ELSE")) {
            data = data.replaceAll("ELSE", "} else {");
        }
        //////////alert("data3(else)==>"+data)
        if (data.includes("dbms_output.put_line".toUpperCase())) {
            data = data.replaceAll("dbms_output.put_line".toUpperCase(), "console.log");
        }
        //////////alert("data3(conso)==>"+data)
        if (data.includes("END LOOP;")) {
            data = data.replaceAll("END LOOP;", "}");
        }
        //////////alert("data3(end loop)==>"+data)
       
        if(data.includes("MSGBOX"))
{
    data = data.replaceAll("MSGBOX", "alert");
}

        if (data.includes("FOR")) {
            var temp;
            var jsFor="";
            if(forline!=null && forline.length>0){
                for(let fl=0;fl<forline.length;fl++){
                    if(forline[fl].includes("IN")){
                        temp = forline[fl].match(/IN (.*?) LOOP/g);
                        if(temp!= null && temp.length>0){
                            temp[0] = temp[0].replaceAll("IN","").replaceAll("LOOP","");
    jsFor= " for (var "+forline[fl].split(" ")[1]+"="+temp[0].split("..")[0]+"; "+forline[fl].split(" ")[1]+"<="+temp[0].split("..")[1]+"; "+forline[fl].split(" ")[1]+"++){"
    data = data.replaceAll(forline[fl], jsFor);                    
}
                    }
                    else        if(forline[fl].includes("REVERSE")){
                        temp = forline[fl].match(/REVERSE (.*?) LOOP/g);
                        if(temp!= null && temp.length>0){
    jsFor= " for (var "+forline[fl].split(" ")[1]+"="+temp[0].split("..")[1]+"; "+forline[fl].split(" ")[1]+">="+temp[0].split("..")[0]+"; "+forline[fl].split(" ")[1]+"++){"
    data = data.replaceAll(forline[fl], jsFor);                    
}
                    }
                }

            }

          
        }
    if(data.includes("WHILE")){
        var whileline = data.match(/WHILE (.*?) LOOP/g);
       // alert(whileline);
      //alert("before while =="+data);
    if(whileline!=null && whileline.length>0){
            for(var w =0;w<whileline.length;w++){
                this.xyz=" WHILE ("+whileline[w].replaceAll("WHILE","").replaceAll("LOOP","")+") {";
              //  alert(this.xyz+"--"+whileline[w]);
                if (this.xyz.includes("==")) {
                  this.xyz=  this.xyz.replaceAll("==","=");
                  //alert("===")
                }
               // alert(this.xyz+"--"+whileline[w]);
                data = data.replaceAll(whileline[w], this.xyz);  
               // alert("after while"+data);
            }
    }
}


        //////////alert("after for loop==>"+data);
        if (data.includes("LOOP")) {
            data = data.replaceAll("LOOP", "{");
        }
        ////////////alert("data3(end loop)==>"+data)
        if (data.includes("END;")) {
            data = data.replaceAll("END;", "");
        }

        if (data.includes("||")) {
         //   alert("pipe")
            data = data.replaceAll("||", "+");
        }
        

       
        data = data.toLowerCase();
        if(quotedStr!=null && quotedStr.length>0){
            for(var q=0;q<quotedStr.length;q++){
               // ////////////alert(quotedStr[q]);
                if(data.includes(quotedStr[q].toLowerCase())){
                    data = data.replaceAll(quotedStr[q].toLowerCase(), quotedStr[q]);
                }
            }
        }
       // if (data.includes(":")) {
          //  data = data.replaceAll(":", "");
       // }

        if(data.includes("round")){
            data = data.replaceAll("round", "SqlUtil.round");
        }

        if(data.includes("initcap")){
            data = data.replaceAll("initcap", "SqlUtil.initcap");
        }
        if(data.includes("decode")){
            data = data.replaceAll("decode", "SqlUtil.decode");
        }
        if(data.includes("exp")){
            data = data.replaceAll("exp", "SqlUtil.exp");
        }
        if(data.includes("remainder")){
            data = data.replaceAll("remainder", "SqlUtil.remainder");
        }
        if(data.includes("mod")){
            data = data.replaceAll("mod", "SqlUtil.mod");
        }
        if(data.includes("rpad")){
            data = data.replaceAll("rpad", "SqlUtil.rpad");
        }
        if(data.includes("lpad")){
            data = data.replaceAll("lpad", "SqlUtil.lpad");
        }
        if(data.includes("length")){
            data = data.replaceAll("length", "SqlUtil.LENGTH");
        }
        if(data.includes("substr")){
            data = data.replaceAll("substr", "SqlUtil.substr");
        }
        if(data.includes("trim")){
            data = data.replaceAll("trim", "SqlUtil.trim");
        }
        if(data.includes("ltrim")){
            data = data.replaceAll("ltrim", "SqlUtil.ltrim");
        }
        if(data.includes("rtrim")){
            data = data.replaceAll("rtrim", "SqlUtil.rtrim");
        }
        if(data.includes("lower")){
            data = data.replaceAll("lower", "SqlUtil.lower");
        }
        if(data.includes("upper")){
            data = data.replaceAll("upper", "SqlUtil.upper");
        }
        if(data.includes("chr")){
            data = data.replaceAll("chr", "SqlUtil.chr");
        }
        if(data.includes("ascii")){
            data = data.replaceAll("ascii", "SqlUtil.ascii");
        }
        if(data.includes("nvl")){
            data = data.replaceAll("nvl", "SqlUtil.nvl");
        }
        if(data.includes("power")){
            data = data.replaceAll("power", "SqlUtil.power");
        }
        if(data.includes("ceil")){
            data = data.replaceAll("ceil", "SqlUtil.ceil");
        }
        if(data.includes("floor")){
            data = data.replaceAll("floor", "SqlUtil.floor");
        }
        if(data.includes("sqrt")){
            data = data.replaceAll("sqrt", "SqlUtil.sqrt");
        }
        if(data.includes("abs")){
            data = data.replaceAll("abs", "SqlUtil.abs");
        }
       
      

        var bindVarLogic = data.match(/:(.*?)[=,*,+,/,%,-,(,;]/g);
      //  alert(bindVarLogic);
        if(bindVarLogic && bindVarLogic.length>0){
            for(var b=0;b<bindVarLogic.length;b++){
                let d = bindVarLogic[b].replaceAll(":","").trim();
                
              
                    if(d && d!==""){
                    let bindData =  "GET_ITEM_VALUE(\'"+d.replaceAll("=","").replaceAll(";","")+"\',NULL)"+d.substr(d.length-1);
                    if(d.includes(".") && d.split(".").length>2){
                        bindData =  "GET_ITEM_VALUE(\'"+d.replaceAll("=","").replaceAll(";","")+"\',"+d.split(".")[2].replaceAll("=","")+")"+d.substr(d.length-1);
                    }
               
             //   alert(bindData);
               data=  data.replaceAll(bindVarLogic[b],bindData);
               // }
            }
            }
            
        }
      //  alert(data);
        var bindVarLogic = data.match(/\^(.*?)@assign@/g);
    //    alert("logic:  "+bindVarLogic);
        if(bindVarLogic && bindVarLogic.length>0){
            for(var b=0;b<bindVarLogic.length;b++){
                let d = bindVarLogic[b].replaceAll('^',"").trim();
                
                if(d && d !==""){
                    let bindData =  "SET_ITEM_VALUE(\'"+d.replaceAll("@assign@","").replaceAll(";","")+"\',NULL)@assign@";
                    if(d.includes(".") && d.split(".").length>2){
                        bindData =  "SET_ITEM_VALUE(\'"+d.replaceAll("@assign@","").replaceAll(";","")+"\',"+d.split(".")[2].replaceAll("@assign@","")+")@assign@";
                    }
               
              //  alert(bindData);
               data=  data.replaceAll(bindVarLogic[b],bindData);
                }
            }
            
        }
        if (data.includes("@assign@")) {
            data = data.replaceAll("@assign@", "=");
        }
        if (data.includes("sysdate")) {
            data = data.replaceAll("sysdate", "this.today");
        }
        var setvalue = data.match(/SET_ITEM_VALUE(.*?);/g);
      
        if(setvalue && setvalue.length>0){
            for(var i=0;i<setvalue.length;i++){
                if(setvalue[i].includes("=")){
                    
                    let temp = setvalue[i].split("=")[1];
                    
                    let temp1 = setvalue[i].split("=")[0].replaceAll(")","")+","+temp.replaceAll(";","") +");";
                 
                   data= data.replaceAll(setvalue[i],temp1);
                }
            }

        }

       


        //inner loop logic start
/*
var ls="@LS@";
var le="@LE@";
var endLoop = data.match("/END LOOP;/g");
if(endLoop && endLoop.length>0){
    for(var a=0;a<endLoop.length;a++){
        var findex = data.indexOf("LOOP");
        data = data.substr(0+findex)+ls+a+data.substr(findex+4,data.length);
        var lindex = data.l
    }
}*/






//inner loop logic end

        return data;
    }

}