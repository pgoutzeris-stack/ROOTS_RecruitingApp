import { getSections } from '../data/sections';

/**
 * Computes dynamic section numbering for the given round.
 * @param {boolean} isZweit - Whether this is a second interview
 * @returns {Array<{ mainNumber: number|null, subNumber: string|null, visible: boolean }>}
 */
export const computeSectionNumbers = (isZweit) => {
  const sections = getSections(isZweit);
  let mainNum = 0;
  let subNum = 0;
  let parentNum = 0;

  return sections.map((section) => {
    let mainNumber = null;
    let subNumber = null;

    if (section.main) {
      mainNum += 1;
      subNum = 0;
      mainNumber = mainNum;
      parentNum = mainNum;
    }
    if (section.sub) {
      subNum += 1;
      subNumber = `${parentNum}.${subNum}`;
    }

    return { mainNumber, subNumber, visible: true };
  });
};
