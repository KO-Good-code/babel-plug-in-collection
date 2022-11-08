export default function create(){
  return new Promise((resolve, reject) =>{
    setTimeout(() => {
      reject(`2222`)
    }, 500)
    
  })
}