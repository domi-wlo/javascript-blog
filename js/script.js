'use strict';

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);

  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  
  console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector('.posts article'+ articleSelector);

  console.log(targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};



const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags',
  optCloudClassCount = 3,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);

  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  for (const article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    console.log(linkHTML);

    /* insert link into titleList */
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();



const calculateTagsParams = function(tags){
  const params = {min: 999999, max: 0};

  for (let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');

    if(tags[tag] > params.max){
      params.max = tags[tag];
    }

    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  console.log(params);
  return params;
};

function calculateTagClass(count, params){

  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1 );
  const tagCloudClass = optCloudClassPrefix + classNumber;

  return tagCloudClass;
  
}


function generateTags(){

  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (const article of articles){

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html ='';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      console.log(tag);
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      /* add generated code to html variable */
      html = html + ' ' + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag]=1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.insertAdjacentHTML('beforeend', html);

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsHTML += '<li><a href="#tag-' + tag + '" class="'+ calculateTagClass(allTags[tag], tagsParams) +'">' + tag +'</a></li> ';
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;

  
}

generateTags();


const tagClickHandler = function(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Tag was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.substring(5);
  console.log('Clicked tag: '+ tag);

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let tagLink of activeTagLinks){

    /* remove class active */
    tagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let link of allTagLinks){

    /* add class active */
    link.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
};


function addClickListenersToTags(){
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');
  console.log(links);

  /* START LOOP: for each link */
  for(let link of links){

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();



function generateAuthors(){

  let allAuthors = {};

  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  for (const article of articles){

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);

    /*create author in article link*/
    const authorHTML = '<a href="#author-' + articleAuthor + '">by ' + articleAuthor + '</a>';

    //add author to the list (only if it not there already)
    if(!allAuthors[articleAuthor]) {
      allAuthors[articleAuthor]=1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /*add author to the article*/
    authorWrapper.insertAdjacentHTML('beforeend', authorHTML);
  }

  const authorsList = document.querySelector(optAuthorsListSelector);
  let allAuthorsHTML = '';

  for(let author in allAuthors){
    allAuthorsHTML += '<li><a href="#author-' + author + '"><span class="author-name">'+ author + ' (' + allAuthors[author] + ')</span></a></li>';
  }

  authorsList.innerHTML = allAuthorsHTML;
}

generateAuthors();


const authorClickHandler = function(event){
  event.preventDefault();

  const clickedElement = this;
  console.log('Author name was clicked!');

  const href = clickedElement.getAttribute('href');
  const author = href.substring(8);
  console.log('Clicked author: '+ author);

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for (let authorLink of activeAuthorLinks){
    authorLink.classList.remove('active');
  }

  const allAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let link of allAuthorLinks){
    link.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
};


function addClickListenersToAuthors(){

  const links = document.querySelectorAll('a[href^="#author-"]');
  console.log(links);

  for(let link of links){

    link.addEventListener('click', authorClickHandler);

  }
}

addClickListenersToAuthors();


