import { useEffect, useState } from 'react'
import { getCoaches, getStudents, UserType } from '../services/api'

interface Props {
  onSelect: (value: string) => void
  userType: UserType
  selectedOption?: string
}

export default function AvailabilityEditor(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [options, setOptions] = useState()

  useEffect(() => {
    if(props.userType == 'coaches') {
      getCoaches().then((users) => setOptions(users))
    }
    else {
      getStudents().then((users) => setOptions(users))
    }
  }, [])

  useEffect(() => {
    if(props.selectedOption && options) {
      const selected = options.findIndex((opt) => opt.id == props.selectedOption)
      if(selected != null) {
        console.log(selected)
        setSelectedOption(selected)
      }
    }
  }, [options])

  const handleOptionClick = (option: number) => {
    setSelectedOption(option);
    props.onSelect(options[option].id);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '200px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          cursor: 'pointer',
          background: '#fff',
          position: 'relative',
        }}
      >
        {selectedOption != null ? options[selectedOption].name : "choose"}
      </div>

      {isOpen && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '10px',
            border: '1px solid #ccc',
            background: '#fff',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          {options.map((option, idx) => (
            <li
              key={option.id}
              onClick={() => handleOptionClick(idx)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                background: selectedOption === idx ? '#f0f0f0' : '#fff',
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
