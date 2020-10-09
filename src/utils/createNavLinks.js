const createAnchor = (href, text, classNames) => {
  const anchorEl = document.createElement('a');
  anchorEl.href = href;
  anchorEl.innerHTML = text;
  anchorEl.className = classNames;
  return anchorEl;
}

export default () => {

  // returns an array of nav links depending on the current page
  const navLinks = [];

  const allPages = {
    scenario1: 'IN STORE',
    scenario2: 'AT HOME',
    scenario3: 'LATER',
  };
  const pagesArray = Object.keys(allPages).sort();
  const homeText = '';
    
  // get current route
  const splitPath = window.location.pathname.split('/');
  const routeIndex = splitPath.length - 2;
  const currRoute = splitPath[routeIndex];

  const pageIndex = pagesArray.indexOf(currRoute);

  if (!currRoute || pageIndex === -1) {
    // we are on the home page and already have our navlinks
    return navLinks;
  }

  const prevPage = pagesArray[pageIndex - 1];
  const nextPage = pagesArray[pageIndex + 1];
  // add prev page link
  if (prevPage) {
    splitPath[routeIndex] = prevPage;
    const href = splitPath.join('/');
    const text = `&larr; ${allPages[prevPage]}`;
    const classNames = 'navlink navlink-left';
    navLinks.push(
      createAnchor(href, text, classNames)
    );
  }
  // add next page link
  if (nextPage) {
    splitPath[routeIndex] = nextPage;
    const href = splitPath.join('/');
    const text = `${allPages[nextPage]} &rarr;`;
    const classNames = 'navlink navlink-right';
    navLinks.push(
      createAnchor(href, text, classNames)
    );
  }

  // add home page link
  const homeSplit = splitPath.slice(0, routeIndex);
  const homeHref = homeSplit.length > 1 ? homeSplit.join('/') : '/';
  const classNames = 'navlink navlink-center';
  navLinks.push(
    createAnchor(homeHref, homeText, classNames)
  );

  return navLinks;

};