
document.addEventListener("hashchange", function() {
    console.log("La page est entièrement chargée !");
   if (!window?.ws){
    location.replace("#/")
   }
});