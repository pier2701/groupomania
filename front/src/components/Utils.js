// on met en place la logique pour traiter les "data" de la date
export const dateParser = (num) => {
    let options = { // paramètres voulus
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    let timestamp = Date.parse(num);

    // on applique les paramètres de la date
    let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

    return date.toString(); // on récupère les "data" en carctères exploitables pour le "user"
};

// on met en place la logique pour traiter les "data" du "timestamp"
export const timestampParser = (num) => {
    let options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    let date = new Date(num).toLocaleDateString("fr-FR", options);

    return date.toString();
}

// la logique "isEmpty" permet de retourner une valeur et d'éviter un champ vide
export const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
    );
};
