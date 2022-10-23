export function truncateText(text, max_char){
        if(text.length <= max_char){
                return text;
        }
        return  text.slice(0,max_char-2) + '...';
}

