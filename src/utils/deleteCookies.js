const deleteCookies = () => {
    document.cookie = "app-automation-actionApi=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "app-automation-next=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "app-automation-testId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export default deleteCookies;
