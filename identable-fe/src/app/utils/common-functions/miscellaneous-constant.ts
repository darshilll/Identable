export class MiscellaneousConstant {
  // EMAIL
  public static emailPattern =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  // EMAIL WITH CAPS
  public static emailPatternWithCaps =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // NAME
  public static namePattern = /^[a-zA-Z ]{1,15}$/;
  public static namePatternWithoutSpace = /^[a-zA-Z]+$/;
  public static namePatternWithNumber = /^[a-zA-Z0-9 ]*$/;
  public static ipv4Pettern =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // phone
  public static phonePattern =
    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  //password
  public static passwordPattern =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

  //number
  public static numberOnly = /^[0-9]{6}$/;

  //year-Build
  public static yearBuild = /^([0-9]{4})$/;

  public static zipPattern = /^([0-9]{5})$/;

  public static linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;

  public static phoneMask = [
    /[2-9]/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
}
