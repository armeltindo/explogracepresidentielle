import type { ChangeEvent } from 'react';
import type { FacetOption } from '../lib/filtering';
import { Button } from './ui/Button';

interface SelectProps {
  label: string;
  allLabel: string;
  value: string;
  options: FacetOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

function FacetSelect({ label, allLabel, value, options, onChange }: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      aria-label={label}
      className="max-w-[210px] border border-line bg-white px-[11px] py-[10px] text-[13px]"
    >
      <option value="">{allLabel}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface Props {
  search: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  filterCour: string;
  courOptions: FacetOption[];
  onCourChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  filterTrib: string;
  tribOptions: FacetOption[];
  onTribChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  filterCat: string;
  catOptions: FacetOption[];
  onCatChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  filterPrison: string;
  prisonOptions: FacetOption[];
  onPrisonChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

export function FilterBar(props: Props) {
  return (
    <section className="no-print sticky top-0 z-30 flex flex-wrap items-center gap-[10px] border border-line border-t-[3px] border-t-green bg-white/95 px-4 py-[14px] shadow-[0_6px_14px_rgba(20,37,28,0.07)] backdrop-blur-sm">
      <input
        type="text"
        value={props.search}
        onChange={props.onSearchChange}
        aria-label="Recherche"
        placeholder="Rechercher : nom, infraction, dossier, lieu…"
        className="flex-1 basis-[250px] border border-line px-3 py-[10px] text-sm"
      />
      <FacetSelect
        label="Ressort"
        allLabel="Ressort — tous"
        value={props.filterCour}
        options={props.courOptions}
        onChange={props.onCourChange}
      />
      <FacetSelect
        label="Tribunal"
        allLabel="Tribunal — tous"
        value={props.filterTrib}
        options={props.tribOptions}
        onChange={props.onTribChange}
      />
      <FacetSelect
        label="Catégorie"
        allLabel="Catégorie — toutes"
        value={props.filterCat}
        options={props.catOptions}
        onChange={props.onCatChange}
      />
      <FacetSelect
        label="Lieu de détention"
        allLabel="Lieu — tous"
        value={props.filterPrison}
        options={props.prisonOptions}
        onChange={props.onPrisonChange}
      />
      <Button variant="danger-ghost" onClick={props.onReset}>
        Réinitialiser
      </Button>
    </section>
  );
}
