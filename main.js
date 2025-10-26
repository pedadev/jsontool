let id;
let img;

function loadState(){
    const savedId = localStorage.getItem("id");
    const savedImg = localStorage.getItem("img");
    
    id = savedId ? parseInt(savedId) : parseInt(document.getElementById("idStart").value);
    img = savedImg ? parseInt(savedImg) : parseInt(document.getElementById("imgStart").value);
    
    const savedEditor = localStorage.getItem("editor");
    document.getElementById("editor").value = savedEditor || "";
}

loadState();

function saveState(){
    localStorage.setItem("editor", document.getElementById("editor").value);
    localStorage.setItem("id", id.toString());
    localStorage.setItem("img", img.toString());
}

function escapeJSON(str){
    return str.replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r')
              .replace(/\t/g, '\\t');
}

document.getElementById("addBtn").addEventListener("click", () => {
    const cat = document.getElementById("category").value;
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const link = document.getElementById("link").value.trim();

    if(!name) return alert("Name fehlt!");

    const escapedName = escapeJSON(name);
    const escapedPrice = escapeJSON(price);
    const escapedLink = escapeJSON(link);

    const obj = `{"id":${id},"name":"${escapedName}","category":"${cat}","price":"${escapedPrice}","image":"/category/images/${cat}/${img}.webp","link":"${escapedLink}"},`;

    const ed = document.getElementById("editor");
    ed.value += (ed.value ? "\n" : "") + obj;

    id++;
    img++;

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("link").value = "";

    saveState();
});

document.getElementById("sendWeb").addEventListener("click", async()=>{
    const text = document.getElementById("editor").value;
    if(!text.trim()) return alert("Keine Daten!");

    const webhook = prompt("Webhook URL eingeben:");
    if(!webhook) return;

    try{
        // Discord Webhook Format - Sende als Code Block
        const discordPayload = {
            content: "```json\n" + text.trim() + "\n```"
        };
        
        console.log("Sending to Discord:", discordPayload);
        
        const res = await fetch(webhook, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(discordPayload)
        });
        
        if(res.ok){
            alert("✅ Erfolgreich an Discord gesendet!");
        } else {
            const errText = await res.text().catch(()=>"");
            alert(`⚠️ Fehler ${res.status}: ${errText || res.statusText}`);
            console.error("Response:", errText);
        }
    }catch(e){
        alert("❌ Fehler: " + e.message);
        console.error(e);
    }
});

document.getElementById("resetBtn").addEventListener("click", ()=>{
    if(confirm("Alles löschen?")){
        localStorage.clear();
        document.getElementById("editor").value = "";
        id = parseInt(document.getElementById("idStart").value);
        img = parseInt(document.getElementById("imgStart").value);
        saveState();
    }
});