const newPromise = new Promise((res, rej)=>{
    setTimeout(()=>{
        console.log("Inside new Promise");
    }, 3000)
});

const promise2 = 20;

const promise = new Promise(res => console.log("Solving promise"))


const p = new Promise((resolveOuter)=>{
    console.log("Inside outer promise")
    resolveOuter((
        new Promise((resolveInner)=>{
            console.log("Inside inner promise")
            setTimeout(resolveInner, 2000)
        })
    ))
})

console.log(p);

const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("foo");
    }, 300);
});
  
