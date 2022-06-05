const searchText = document.getElementById('search-text')
const searchBtn = document.getElementById('search-btn')
const containerMobile = document.querySelector('.container-mobile')
const randomMealsList = document.querySelector('.random-meals')
const rndmBtn = document.getElementById('random-btn');
const favoriteList = document.querySelector('#favorite-list')
const listMeals = document.querySelector('.list-meals')

let randoMealFlag = true

const buildMeal = (element, list, type) => {
    let divMeal = document.createElement('div')
    let divImg = document.createElement('div')
    let divDesc = document.createElement('div')
    let img = document.createElement('img')
    let h3 = document.createElement('h3')
    let i = document.createElement('i')

    divMeal.classList.add(type !== 'random'?'meal':'random-meal')
    divImg.classList.add(type !== 'random'?'meal-img':'random-meal-img')
    divDesc.classList.add(type !== 'random'?'meal-description':'random-meal-description')
    img.src = element['strMealThumb']
    h3.innerText = element['strMeal']
    i.id = 'heart'
    i.classList.add('fa-regular')
    i.classList.add('fa-heart')

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
        buildMeal(element,listMeals,'meal')
    });
}

const randomMeal = async () => {
    const listMeals = document.querySelector('.list-meals')
    const { meals } = await getRandomMealApi();
    
    listMeals.innerText = ""
    randomMealsList.innerText = ""
    
    buildMeal(meals[0], randomMealsList, 'random')
}

const likeMeal = async (event) =>{
    if(event.target.id === 'heart'){
        let imgEl = document.createElement('img')
        let pEl = document.createElement('p')
        let li = document.createElement('li')

        let meal = event.target.parentNode.children[0].textContent; 
        const {meals} = await getMealsApi(meal)

        imgEl.src = meals[0]['strMealThumb']
        pEl.innerText = meals[0]['strMeal']
        li.appendChild(imgEl)
        li.appendChild(pEl)
        favoriteList.appendChild(li)
    }
}

randomMealsList.addEventListener('click', (event) => {
    likeMeal(event)
})

listMeals.addEventListener('click', (event) => {
    likeMeal(event)
})

rndmBtn.addEventListener('click', randomMeal)

searchBtn.addEventListener('click', searchMeal)


const getMealsApi = async (value) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
        return await response.json()
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

randomMeal()
