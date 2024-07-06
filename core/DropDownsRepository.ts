import DropDowns from "./DropDowns";


export default interface DropDownsRepository{
   dropdown(name: string): Promise<DropDowns[]>
}