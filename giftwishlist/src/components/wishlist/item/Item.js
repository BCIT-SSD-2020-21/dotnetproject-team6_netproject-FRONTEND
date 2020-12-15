import React from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Item = (props) => {
    const itemData = props.item;
    const formatPrice = (price) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        return formatter.format(price);
    }

    const deleteItem = (wishlistId, itemId) => {
        
        console.log("deleteItm button clicked for" + itemId + "in wishlistId" + wishlistId);
        fetch(BASE_URL + "wishlist/" + wishlistId + "/item/" + itemId, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            // Data retrieved.
            .then((data) => {
              console.log(JSON.stringify(data));
            //   fetchWishlists();
            })
            // Data not retrieved.
            .catch((e) => {
              console.log(e);
            });
            window.location.href="/wishlist/" + wishlistId;
    }

    const toggleCompletedStatus = async (
            wishlistId,
            itemId,        
        ) => {
        console.log("completed button clickedfor" + itemId + "in wishlistId" + wishlistId);
        console.log(itemData.isComplete)
        const response = await fetch(BASE_URL + "wishlist/" + wishlistId + "/item/" + itemId, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("bearer-token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Id: itemId,
                isComplete: !itemData.isComplete,
                wishlistID: wishlistId,
              }),
          }).catch((err) => console.log(err));
            if (response.status > 400) {
                return response;
              }
            return await response.json();
            // window.location.href="/wishlist/" + wishlistId;
    }

    return (
        <tr>
            <td>{itemData.name}</td>
            <td>{itemData.description}</td>
            <td><img src={itemData.imageURL} alt={itemData.name}></img></td>
            <td><a href={itemData.purchaseURL}>Purchase</a></td>
            <td>{formatPrice(itemData.price)}</td>
            <td>
                <button className="button" onClick={() => toggleCompletedStatus(itemData.wishlistID, itemData.id)}>
                    {itemData.isComplete ? '✔' : '❌'}
                </button>
            </td>
            <td>
                <button className="button" onClick={() => deleteItem(itemData.wishlistID, itemData.id)}>
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default Item;
