const searchText = document.getElementById('search-text')
const searchBtn = document.getElementById('search-btn')
const randomMealsList = document.querySelector('.random-meals')
const rndmBtn = document.getElementById('random-btn');
const favoriteList = document.querySelector('#favorite-list')
const listMeals = document.querySelector('.list-meals')
const popup = document.querySelector('.popup')
const closePopupBtn = document.querySelector('#popup-close')
const myLocalStorage = localStorage;

const mealsLS = []

let randoMealFlag = true

const buildMeal = (element, list, type) => {
    let divMeal = document.createElement('div')
    let divImg = document.createElement('div')
    let divDesc = document.createElement('div')
    let img = document.createElement('img')
    let h3 = document.createElement('h3')
    let i = document.createElement('i')

    divMeal.classList.add(type !== 'random' ? 'meal' : 'random-meal')
    divImg.classList.add(type !== 'random' ? 'meal-img' : 'random-meal-img')
    divDesc.classList.add(type !== 'random' ? 'meal-description' : 'random-meal-description')
    img.src = element['strMealThumb']
    h3.innerText = element['strMeal']
    i.id = 'heart'
    i.classList.add('fa-regular', 'fa-heart')

    divImg.appendChild(img)
    divDesc.appendChild(h3)
    divDesc.appendChild(i)
    divMeal.appendChild(divImg)
    divMeal.appendChild(divDesc)
    list.appendChild(divMeal)
}

const searchMeal = async () => {
    const listMeals = document.querySelector('.list-meals')
    const text = searchText.value;
    const { meals } = await getMealsApi(text);
    let listMealsEl = document.createElement('div')
    listMealsEl.classList.add('list-meals')

    listMeals.innerText = ""
    randomMealsList.innerText = ""

    meals.forEach(element => {
        buildMeal(element, listMeals, 'meal')
    });
}

const randomMeal = async () => {
    const listMeals = document.querySelector('.list-meals')
    const { meals } = await getRandomMealApi();

    listMeals.innerText = ""
    randomMealsList.innerText = ""

    buildMeal(meals[0], randomMealsList, 'random')
}

const likeMeal = async (event, card) => {
    if (event.target.id === 'heart') {
        let imgEl = document.createElement('img')
        let pEl = document.createElement('p')
        let li = document.createElement('li')

       
       

        let meal = event.target.parentNode.children[0].textContent;
        const { meals } = await getMealsApi(meal)
        
        addMealsLS(meals)

        imgEl.src = meals[0]['strMealThumb']
        imgEl.classList.add('fav-img')
        pEl.innerText = meals[0]['strMeal']
        li.appendChild(imgEl)
        li.appendChild(pEl)
        favoriteList.appendChild(li)
        if(card === 'random')
            randomMeal()
    }
}

const showMeal = async (meal) => {
    const containerMobile = document.querySelector('.container-mobile')
    const title = document.querySelector('#popup-title')
    const img = document.querySelector('#popup-img')
    const desc = document.querySelector('#popup-desc')
    popup.classList.add('activate')
    containerMobile.classList.add('blur')
    // const { meals } = await getMealsApi(meal)
    doidera = myLocalStorage.getItem('Like-Recipe')
    let text = JSON.parse(doidera)
    text.forEach(e => {
        if(e[0]['strMeal'] === meal)
        {img.src = e[0]['strMealThumb']
        title.innerText = e[0]['strMeal']
        desc.innerText = e[0]['strInstructions']}
    })
   
}

randomMealsList.addEventListener('click', (event) => {
    if (event.target.parentNode.className === "random-meal-img") {
        const meal = event.target.parentNode.parentNode.children[1].children[0].textContent;
        showMeal(meal)
    }
    likeMeal(event, 'random')
})

listMeals.addEventListener('click', (event) => {
    if (event.target.parentNode.className === "meal-img") {
        const meal = event.target.parentNode.parentNode.children[1].children[0].textContent;
        showMeal(meal)
    }
    likeMeal(event, 'meal')
})

rndmBtn.addEventListener('click', randomMeal)

searchBtn.addEventListener('click', searchMeal)

favoriteList.addEventListener('click', async (event) => {
    if (event.target.className === "fav-img") {
        const meal = event.target.nextSibling.textContent;
        showMeal(meal)
    }
})

closePopupBtn.addEventListener('click', () => {
    const containerMobile = document.querySelector('.container-mobile')
    popup.classList.remove('activate')
    containerMobile.classList.remove('blur')
})

const addMealsLS = (meal) =>{
    // myLocalStorage.removeItem('Recipe')
    mealsLS.push(meal)
    newArr = [...mealsLS]
    myLocalStorage.setItem('Like-Recipe', [JSON.stringify(newArr)])
    // doidera = myLocalStorage.getItem('Like-Recipe')
    // let text = JSON.parse(doidera)
    // console.log(text)
   
}

const removeMealsLS = () =>{
    
    
}


const getMealsApi = async (value) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
        const meal =  await response.json()
        // const {meals} = meal
        // console.log(meals);
        // myLocalStorage.setItem('Recipe-Name', [])
        // myLocalStorage.setItem('Recipe-Img', [])
        // meals.forEach(e => {
        //     myLocalStorage.getItem('Recipe-Img');
        //     console.log(e['strMealThumb']);
        // })
        // console.log(myLocalStorage.getItem('Recipe-Img'));
        return meal
    } catch (error) {
        console.log(error);
    }

}

const getRandomMealApi = async () => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        return await response.json()
    } catch (error) {
        console.log(error);
    }

}

// randomMeal()
