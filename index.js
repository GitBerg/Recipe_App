const searchText = document.getElementById('search-text')
const searchBtn = document.getElementById('search-btn')
const randomMealsList = document.querySelector('.random-meals')
const rndmBtn = document.getElementById('random-btn');
const favoriteList = document.querySelector('#favorite-list')
const listMeals = document.querySelector('.list-meals')
const popup = document.querySelector('.popup')
const closePopupBtn = document.querySelector('#popup-close')
const myLocalStorage = localStorage;
const closeFVT = document.querySelector('#close')

let rMealsLS = []
let sMealsLS = []
let lMealsLS = []

const setMealsLike = new Set();
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
    const setMealsSearch = new Set();

    sMealsLS = [...meals].filter((el) => {
        const duplicateMeals = setMealsSearch.has(el['idMeal']) || setMealsLike.has(el['idMeal'])
        setMealsSearch.add(el['idMeal'])
        return !duplicateMeals;
    })

    myLocalStorage.setItem('Search-Recipe', JSON.stringify(sMealsLS))
    const convertedSearch = JSON.parse(myLocalStorage.getItem('Search-Recipe'))

    listMeals.innerText = ""
    randomMealsList.innerText = ""

    convertedSearch.forEach(element => {
        buildMeal(element, listMeals, 'meal')
    });

}

const randomMeal = async () => {
    const listMeals = document.querySelector('.list-meals')
    const { meals } = await getRandomMealApi();
    const setMealsRandom = new Set();

    if (setMealsLike.has(meals[0]['idMeal']))
        return randomMeal()

    rMealsLS = [...meals].filter((el) => {
        const duplicateMeals = setMealsRandom.has(el['idMeal']) || setMealsLike.has(el['idMeal'])
        setMealsRandom.add(el['idMeal'])
        return !duplicateMeals;
    })

    myLocalStorage.setItem('Random-Recipe', JSON.stringify(rMealsLS))

    listMeals.innerText = ""
    randomMealsList.innerText = ""


    buildMeal(meals[0], randomMealsList, 'random')
}

const likeMeal = async (event, card) => {

    if (event.target.id === 'heart') {
        event.target.classList.add('liked')

        let meal = event.target.parentNode.children[0].textContent;
        const { meals } = await getMealsApi(meal)

        lMealsLS = [...lMealsLS, meals[0]].filter(el => {
            setMealsLike.add(el['idMeal'])
            return true
        })

        myLocalStorage.setItem('Like-Recipe', JSON.stringify(lMealsLS))

        buildFavList(lMealsLS)

        if (card === 'random') {
            randomMeal()
        } else {
            searchMeal()
        }

        console.log(lMealsLS);
    }
}


const buildFavList = (meals) => {
    favoriteList.innerText = '';
    meals.forEach(meal => {
        let imgEl = document.createElement('img')
        let pEl = document.createElement('p')
        let li = document.createElement('li')
        let i = document.createElement('i')
        imgEl.src = meal['strMealThumb']
        imgEl.classList.add('fav-img')
        pEl.innerText = meal['strMeal']
        i.classList.add('fa-solid', 'fa-circle-xmark')
        i.id = 'close'
        li.appendChild(i)
        li.appendChild(imgEl)
        li.appendChild(pEl)
        favoriteList.appendChild(li)
    })
}

const showMeal = (meal, type) => {
    const containerMobile = document.querySelector('.container-mobile')
    const title = document.querySelector('#popup-title')
    const img = document.querySelector('#popup-img')
    const desc = document.querySelector('#popup-desc')
    const ingred = document.querySelector('#popup-ingred')
    
    ingred.innerText = ""

    popup.classList.add('activate')
    containerMobile.classList.add('blur')
    let text = JSON.parse(myLocalStorage.getItem(`${type}`))
    text.forEach(e => {
        if (e['strMeal'] === meal) {
            img.src = e['strMealThumb']
            title.innerText = e['strMeal']
            desc.innerText = e['strInstructions']
            for (let index = 1; index <= 20; index++) {
                if(e[`strIngredient${index}`])
                    ingred.innerText += `${e[`strIngredient${index}`]} - ${e[`strMeasure${index}`]}\n`
            }
        }
    })

}

randomMealsList.addEventListener('click', (event) => {
    if (event.target.parentNode.className === "random-meal-img") {
        const meal = event.target.parentNode.parentNode.children[1].children[0].textContent;
        showMeal(meal, 'Random-Recipe')
    }
    likeMeal(event, 'random')
})

listMeals.addEventListener('click', (event) => {
    if (event.target.parentNode.className === "meal-img") {
        const meal = event.target.parentNode.parentNode.children[1].children[0].textContent;
        showMeal(meal, 'Search-Recipe')
    }
    likeMeal(event, 'meal')
})

rndmBtn.addEventListener('click', randomMeal)

searchBtn.addEventListener('click', searchMeal)

favoriteList.addEventListener('click', (event) => {
    if (event.target.className === "fav-img") {
        let meal = event.target.nextSibling.textContent;
        showMeal(meal, 'Like-Recipe')
    }
    if (event.target.id === 'close') {
        let meal = event.target.nextSibling.nextSibling.textContent;
        const index = lMealsLS.findIndex(e => {
            if (e['strMeal'] === meal) {
                setMealsLike.delete(e['idMeal'])
                return e
            }

        })
        favoriteList.innerText = ""
        lMealsLS.splice(index, 1)
        myLocalStorage.setItem('Like-Recipe', JSON.stringify(lMealsLS))
        let text = JSON.parse(myLocalStorage.getItem(`Like-Recipe`))
        buildFavList(text)
    }
})

closePopupBtn.addEventListener('click', () => {
    const containerMobile = document.querySelector('.container-mobile')
    popup.classList.remove('activate')
    containerMobile.classList.remove('blur')
})

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
