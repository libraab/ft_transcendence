/**
 * Here we use load function to extract the roomId from the url parameters
 * It is usefull for dynamics root 
 */

export function load({ params }) {
	return {
		roomId: params.roomId
	};
}