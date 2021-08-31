interface SearchBarProps {
    options: google.maps.places.AutocompleteOptions
}

const SearchBar: React.FC<SearchBarProps> = ({ options }) => {
    const inputRef = (node: HTMLInputElement) => {}

    // Acquire autocomplete service from google namespace
    const auto = new google.maps.places.Autocomplete(input, options)
}
