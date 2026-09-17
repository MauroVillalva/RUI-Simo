
export const dateHandler = (date) => {
  try {
    const day = date?.getDate();

    const month = ((date?.getMonth() + 1) < 10) && ('0' + (date?.getMonth() + 1)) || date?.getMonth() + 1;
    const year = date?.getFullYear();

    const hour = (date?.getHours() < 10) && ('0' + date?.getHours()) || date?.getHours();
    const min = (date?.getMinutes() < 10) && ('0' + date?.getMinutes()) || date?.getMinutes();
    const sec = (date?.getSeconds() < 10) && ('0' + date?.getSeconds()) || date?.getSeconds();

    return { day, month, year, hour, min, sec };
  } catch (e) {
    console.log("Error getting time: ", e.message);
  };
};