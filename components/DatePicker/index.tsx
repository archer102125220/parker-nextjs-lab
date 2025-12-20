'use client';

import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import './index.scss';

export interface DatePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | null) => void;
  locale?: 'zh-tw' | 'zh-cn' | 'en' | string;
  format?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  locale = 'zh-tw',
  format = 'YYYY/MM/DD HH:mm',
  label,
  disabled = false,
  className = ''
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    value ? dayjs(value) : null
  );

  // Set dayjs locale
  const dayjsLocale = locale.toLowerCase().replace('_', '-');
  dayjs.locale(dayjsLocale);

  const handleChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    onChange?.(newValue ? newValue.toDate() : null);
  };

  return (
    <div className={`date-picker-wrapper ${className}`}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjsLocale}>
        <MuiDatePicker
          value={selectedDate}
          onChange={handleChange}
          format={format}
          label={label}
          disabled={disabled}
          slotProps={{
            textField: {
              fullWidth: true
            }
          }}
        />
      </LocalizationProvider>
    </div>
  );
}

export default DatePicker;
