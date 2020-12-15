const BASE = process.env.REACT_APP_BASE_URL + "api/";
const BASE_URL = BASE + "wishlist";

// const getById = async (id) => {
//   const response = await fetch(`${BASE_URL}/${id}`).catch((err) =>
//     console.log(err)
//   );
//   const data = await response.json();

//   return data;
// };

const getById = async (id, password) => {
  const response = await fetch(`${BASE_URL}/${id}/?password=${password}`).catch((err) =>
    console.log(err)
  );
  const data = await response.json();
  return data;
};

const createItem = async (
  name,
  description,
  image,
  purchaseLink,
  price,
  wishlistId
) => {
  const response = await fetch(`${BASE_URL}/${wishlistId}/item/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Name: name,
      Description: description,
      ImageURL: image,
      PurchaseUrl: purchaseLink,
      Price: price,
    }),
  }).catch((err) => console.log(err));
  if (response.status > 400) {
    return response;
  }
  const data = await response.json()

  return data;
};

const wishlistService = {
  getById,
  createItem
}

export default wishlistService;
