/** Discrete nod to the national flag layout (vertical green band, yellow-over-red) — never used as a loud color block. */
export function FlagStripe() {
  return (
    <div className="no-print flex h-[6px]">
      <div className="w-[30%] bg-green" />
      <div className="flex w-[70%] flex-col">
        <div className="h-[3px] bg-yellow" />
        <div className="h-[3px] bg-red" />
      </div>
    </div>
  );
}
