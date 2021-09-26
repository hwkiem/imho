import React from 'react';
import MonthPicker from 'react-month-picker';
import { Button } from '@chakra-ui/react';

export const Picker = (props) => {
    const now = new Date();
    const [term, setTerm] = React.useState({
        from: { year: now.getFullYear(), month: now.getMonth() },
        to: { year: now.getFullYear() + 1, month: now.getMonth() },
    });

    React.useEffect(() => {
        const from = new Date(term.from.year, term.from.month);
        const to = new Date(term.to.year, term.to.month);
        props.onChange(from, to);
    }, [term]);

    const monthPickerRef = React.useRef(null);

    const showPicker = () => {
        if (monthPickerRef && monthPickerRef.current) {
            monthPickerRef.current.show();
        }
    };

    const handlePickerChange = (year, month, isEnd) => {
        if (isEnd) {
            setTerm((term) => ({ ...term, to: { year: year, month: month } }));
        } else {
            setTerm((term) => ({
                ...term,
                from: { year: year, month: month },
            }));
        }
    };

    const pickerLang = {
        months: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ],
        from: 'From',
        to: 'To',
    };

    return (
        <MonthPicker
            ref={monthPickerRef}
            lang={pickerLang}
            years={{ min: 2013, max: 2024 }}
            value={term}
            onChange={handlePickerChange}
        >
            <Button onClick={showPicker}>
                {term.from.month} {term.from.year} to {term.to.month}{' '}
                {term.to.year}
            </Button>
        </MonthPicker>
    );
};
