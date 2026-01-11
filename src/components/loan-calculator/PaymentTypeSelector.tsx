import type { PaymentType } from '../../utils/calculator';

interface PaymentTypeSelectorProps {
  value: PaymentType;
  onChange: (type: PaymentType) => void;
}

export function PaymentTypeSelector({ value, onChange }: PaymentTypeSelectorProps) {
  return (
    <div className="payment-type-selector btn-group" role="group" aria-label="Payment strategy">
      <button
        type="button"
        id="avalanche-btn"
        className={`btn ${value === 'avalanche' ? 'btn-primary active' : 'btn-secondary'}`}
        onClick={() => onChange('avalanche')}
        aria-pressed={value === 'avalanche'}
      >
        Avalanche
      </button>
      <button
        type="button"
        id="snowball-btn"
        className={`btn ${value === 'snowball' ? 'btn-primary active' : 'btn-secondary'}`}
        onClick={() => onChange('snowball')}
        aria-pressed={value === 'snowball'}
      >
        Snowball
      </button>
    </div>
  );
}

export default PaymentTypeSelector;
