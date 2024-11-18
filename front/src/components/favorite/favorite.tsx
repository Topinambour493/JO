import {ContactType} from "../../types/types";
import {useFetcher} from "react-router-dom";
import {toggleFavorite} from "../../redux/slices/favorites";
import {useDispatch} from "react-redux";

export default function Favorite({ contact } : { contact: ContactType }) {
    const fetcher = useFetcher();
    const dispatch = useDispatch();
    const favorite = fetcher.formData
        ? fetcher.formData.get("favorite") === "true"
        : contact.favorite;

    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                onClick={()=>{
                  dispatch(toggleFavorite(contact.id))}}
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}