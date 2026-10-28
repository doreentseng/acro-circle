import type { EventInput } from '@/lib/types/event';
import {
  templateSectionClass,
  templateLabelClass,
  templateButtonsClass,
  templateButtonClass
} from '@/lib/styles/template';

type TemplateKey = 'acroyoga' | 'strength';

interface TemplateInput {
  title: EventInput['title'];
  locationId: EventInput['locationId'];
  amount: EventInput['amount'];
  duration: EventInput['duration'];
  bookedBy: EventInput['bookedBy'];
  userIds: EventInput['userIds'];
}

const templates: Record<TemplateKey, TemplateInput> = {
  'acroyoga': {
    'title': 'Acroyoga 練習',
    'locationId': '2',
    'amount': '1000',
    'duration': '2',
    'bookedBy': '3',
    'userIds': ['1', '2', '3', '4']
  },
  'strength': {
    'title': '肌力 B 班',
    'locationId': '1',
    'amount': '400',
    'duration': '1',
    'bookedBy': '1',
    'userIds': ['1', '2', '4', '6'],
  }
} 

export function TemplateSection({
  disabled,
  onApply
} : {
  disabled: boolean;
  onApply: (v: TemplateInput) => void;
}) {
  return (
    <div className={templateSectionClass}>
      <p className={templateLabelClass}>
        選擇模板以快速填寫表單
      </p>

      <div className={templateButtonsClass}>
        <button
          type="button"
          disabled={disabled}
          className={templateButtonClass}
          onClick={() => onApply(templates.acroyoga)}
        >
          🤸🏻 Acroyoga
        </button>

        <button
          type="button"
          disabled={disabled}
          className={templateButtonClass}
          onClick={() => onApply(templates.strength)}
        >
          🏋🏻 肌力 B 班
        </button>
      </div>
    </div>
  )
}
