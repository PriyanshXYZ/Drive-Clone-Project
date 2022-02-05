(function(){
    let btnAddFolder=document.querySelector("#addFolder");
    let btnTxtFolder= document.querySelector("#addTextFile");
    let divBreadCrumb = document.querySelector("#breadcrumb");
    let aRootPath=divBreadCrumb.querySelector("a[purpose=path]");
    let divContainer= document.querySelector("#container");
    

    let divApp=document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-titles-bar");
    let divAppTitle=document.querySelector("#app-title");
    let divAppMenuBar=document.querySelector("#app-menu-bar");
    let divAppBody= document.querySelector("#app-body");

    let templates =document.querySelector("#templates");
    let resources=[];
    let cfid=-1;
    let rid=0;

    btnAddFolder.addEventListener("click", addFolder);
    btnTxtFolder.addEventListener("click",addTxtFile);
    aRootPath.addEventListener("click",viewFoldersFromPath);

    function addFolder(){
        let rname=prompt("Enter Folder Name")
        if(rname !=null){
            rname=rname.trim();
        }
        if(!rname){
            alert("Name cannot be empty");
            return;
        }
        
        let doesExist=resources.some(f=>f.rname==rname && f.rid==cfid);
        if(doesExist){
            alert("this name already exists!");
        }else{
        let pid=cfid;
        rid++;
        //ram
        resources.push({
            rid:rid,
            rname:rname,
            rtype:"folder",
            pid:cfid
        });
        //html
        addFolderToHtml(rname,rid,pid);

        //storage
        saveChangesToStorage();
    }
    }
    function addTxtFile(){
        let rname=prompt("Enter Text File name");
        if(rname !=null){
            rname=rname.trim();
        }
        if(!rname){
            alert("Name cannot be empty");
            return;
        }
        
        let doesExist=resources.some(f=>f.pid==cfid && f.rname==rname);
        if(doesExist){
            alert("this name already exists!");
        }else{
        let pid=cfid;
        rid++;
        //ram
        resources.push({
            rid:rid,
            rname:rname,
            rtype:"text-file",
            pid:cfid,
            isBold:true,
            isItalic:false,
            isUnderline: false,
            bgColor: "#000000",
            textColor: "#ffffff",
            fontFamily:"cursive",
            fontSize:22,
            content:"I am new File."
        });
        //html
        addTextFileToHTML(rname,rid,pid);

        //storage
        saveChangesToStorage();
    }
    }
    function deleteFolder(){
        //to delete folder inside as well
        let spanDelete=this;
        let divFolder=spanDelete.parentNode;
        let divName=divFolder.querySelector("[purpose=name]");

        let fidTBD=parseInt(divFolder.getAttribute("rid"));
        let fname=divName.innerHTML;

        let childrenExist=resources.some(r=>r.pid==fidTBD);
        let sure=confirm(`Are you sure you want to delete ${fname}?`+ (childrenExist?"it has children":""));
        if(!sure){
            return;
        }
        //html
        divContainer.removeChild(divFolder);
        //ram
        deleteHelper(fidTBD);
        //storage
        saveChangesToStorage();
    }
    function deleteHelper(fidTBD){
        let children =resources.filter(r=>r.pid==fidTBD);
        for(let i=0;i<children.length; i++){
            deleteHelper(children[i].rid);//recursive call
        }
        let ridIdx=resources.findIndex(r=>r.rid==fidTBD);
        console.log(resources[ridIdx].rname);
        resources.splice(ridIdx,1);
    }
    function deleteTxtFile(){
        let spanDelete=this;
        let divTxtFile=spanDelete.parentNode;
        let divName=divTxtFile.querySelector("[purpose=name]");

        let fidTBD=parseInt(divTxtFile.getAttribute("rid"));
        let fname=divName.innerHTML;

        let sure=confirm(`Are you sure you want to delete ${fname}?`);
        if(!sure){
            return;
        }
        //html
        divContainer.removeChild(divTxtFile);
        //ram
        let ridIdx=resources.findIndex(r=>r.pid==fidTBD);
        resources.splice(ridIdx,1);
        //storage
        saveChangesToStorage();
    }
    function renameFolder(){
        let newRname=prompt("Enter new name for Folder")
        //to trim name if space is there in input 
        if(newRname !=null){
            newRname=newRname.trim();
        }
        //if user enters cancel 
        if(!newRname){
            alert("Name cannot be set empty");
            return;
        }
        
        let spanRename=this;
        let divFolder=spanRename.parentNode;
        let divName=divFolder.querySelector("[purpose='name']");
        let oldRname=divName.innerHTML;
        let ridToBeUpdated=parseInt(divFolder.getAttribute("rid"));
        //if oldname and newname is same
        if(newRname == oldRname){
            alert("bhai dusra naam rakh na pehele wala kyu rakhra");
            return;
        }
        let alreadyExist=resources.some(r=>r.r.rname==newRname && r.rid==cfid);
        if(alreadyExist){
            alert("this name already exists");
        }
        //ram
        divName.innerHTML=newRname;
        //html
        let resource=resources.find(r=>r.rid==ridToBeUpdated);
        resource.rname=newRname;
        //storage
        saveChangesToStorage();

        
    }
    function renameTxtFile(){
        let newRname=prompt("Enter new name for text-file")
        //to trim name if space is there in input 
        if(newRname !=null){
            newRname=newRname.trim();
        }
        //if user enters cancel 
        if(!newRname){
            alert("Name cannot be set empty");
            return;
        }
        
        let spanRename=this;
        let divTxtFile=spanRename.parentNode;
        let divName=divTxtFile.querySelector("[purpose='name']");
        let oldRname=divName.innerHTML;
        let ridToBeUpdated=parseInt(divTxtFile.getAttribute("rid"));
        //if oldname and newname is same
        if(newRname == oldRname){
            alert("bhai dusra naam rakh na pehele wala kyu rakhra");
            return;
        }
        let alreadyExist=resources.some(r=>r.r.rname==newRname && r.rid==cfid);
        if(alreadyExist){
            alert("this name already exists");
        }
        //ram
        divName.innerHTML=newRname;
        //html
        let resource=resources.find(r=>r.rid==ridToBeUpdated);
        resource.rname=newRname;
        //storage
        saveChangesToStorage();
    }
    function viewFolder(){
        let spanView=this;
        let divFolder=spanView.parentNode;
        let divName=divFolder.querySelector("[purpose=name]");

        let fname=divName.innerHTML;
        let fid=parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate=templates.content.querySelector("a[purpose=path]");
        let aPath=document.importNode(aPathTemplate,true);

        aPath.innerHTML=fname;
        aPath.setAttribute("rid",fid);
        aPath.addEventListener("click",viewFoldersFromPath);
        divBreadCrumb.appendChild(aPath);

        cfid=fid;
        divContainer.innerHTML="";//to show empty if there is no content inside folder
        for(let i=0;i<resources.length; i++){
            if(resources[i].pid==cfid){
                if(resources[i].rtype=="folder"){
                addFolderToHtml(resources[i].rname,resources[i].rid,resources[i].pid);
            }else if(resources[i].rtype== "text-file"){
                addTextFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            }
        }
        }
    }

    function viewFoldersFromPath(){
        let aPath=this;
        let fid=parseInt(aPath.getAttribute("rid"));

        //set the breadcrumb
        while(aPath.nextSibling){
            aPath.parentNode.removeChild(aPath.nextSibling);
        }
        //set the div Container
        cfid=fid;
        divContainer.innerHTML="";
        for(let i=0;i<resources.length; i++){
            if(resources[i].pid==cfid){
                if(resources[i].rtype=="folder"){
                addFolderToHtml(resources[i].rname,resources[i].rid,resources[i].pid);
            }else if(resources[i].rtype== "text-file"){
                addTextFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            }
        }
        }
    }
    function viewTxtFile(){
        let spanView=this;
        let divTxtFile=spanView.parentNode;
        let divName=divTxtFile.querySelector("[purpose=name]");
        let fname=divName.innerHTML;
        let fid=parseInt(divTxtFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose=notepad-menu]");
        let divNotepadMenu =document.importNode(divNotepadMenuTemplate,true);
        divAppMenuBar.innerHTML= "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate =templates.content.querySelector("[purpose=notepad-body]");
        let divNotepadBody=document.importNode(divNotepadBodyTemplate,true);
        divAppBody.innerHTML ="";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML=fname;
        divAppTitle.setAttribute("rid",fid);

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);

        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    }
    
    function saveNotepad(){ 
        let fid=parseInt(divAppTitle.getAttribute("rid"));
        let resource=resources.find(r=>r.rid==fid);

        let spanBold=divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize =divAppMenuBar.querySelector("[action=fomt-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold= spanBold.getAttribute("pressed") =="true";
        resource.isItalic=spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline=spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor=inputBGColor.value;
        resource.textColor=inputTextColor.value;
        resource.fontFamily=selectFontFamily.value;
        resource.selectFontSize=selectFontSize.value;
        resource.content=textArea.value;

        saveChangesToStorage()
    }

    function makeNotepadBold(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }

    function makeNotepadItalic(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }

    function makeNotepadUnderline(){ 
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if(isPressed == false){
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }

    function changeNotepadBGColor(){ 
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }

    function changeNotepadTextColor(){ 
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }

    function changeNotepadFontFamily(){ 
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }

    function changeNotepadFontSize(){ 
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize;
    }
    
    function addFolderToHtml(rname,rid,pid){
        let divFolderTemplate=templates.content.querySelector(".folder");
        let divFolder =document.importNode(divFolderTemplate,true); //makes copy

        let spanRename=divFolder.querySelector("[action='rename']");
        let spanDelete=divFolder.querySelector("[action ='delete']");
        let spanView=divFolder.querySelector("[action='view']");
        spanRename.addEventListener("click",renameFolder);
        spanDelete.addEventListener("click",deleteFolder);
        spanView.addEventListener("click",viewFolder);

        let divName=divFolder.querySelector("[purpose=name]");
        divName.innerHTML=rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    }
    function addTextFileToHTML(rname,rid,pid){
        let divTxtFileTemplate=templates.content.querySelector(".text-file");
        let divTxtFile =document.importNode(divTxtFileTemplate,true); //makes copy

        let spanRename=divTxtFile.querySelector("[action='rename']");
        let spanDelete=divTxtFile.querySelector("[action ='delete']");
        let spanView=divTxtFile.querySelector("[action='view']");
        spanRename.addEventListener("click",renameTxtFile);
        spanDelete.addEventListener("click",deleteTxtFile);
        spanView.addEventListener("click",viewTxtFile);

        let divName=divTxtFile.querySelector("[purpose=name]");
        divName.innerHTML=rname;
        divTxtFile.setAttribute("rid", rid);
        divTxtFile.setAttribute("pid", pid);

        divContainer.appendChild(divTxtFile);
    }
    function saveChangesToStorage(){
        let resourceJson=JSON.stringify(resources);
        localStorage.setItem("data",resourceJson);
    }
    function loadFromStorage(){
        let resourceJson=localStorage.getItem("data");
        if(!!resourceJson){
        resources=JSON.parse(resourceJson);
        for(let i=0;i<resources.length; i++){
            if(resources[i].pid==cfid){
                if(resources[i].rtype=="folder"){
                addFolderToHtml(resources[i].rname,resources[i].rid,resources[i].pid);
            }else if(resources[i].rtype== "text-file"){
                addTextFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
            }
        }
            if(resources[i].rid>rid){
                rid=resources[i].rid;
            }
        }
        }
    }
    loadFromStorage();
})();