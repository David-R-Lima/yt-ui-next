import { useTheme } from "./providers/theme-provider"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Colors } from "@/enums/colors"
import { useAppSettingsStore } from "@/store/app-settings-store"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { color, setColor } = useAppSettingsStore()

  return (
    <div>
      <div className="flex flex-col items-start space-y-4 space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox checked={theme === "light"} onCheckedChange={() => {
              setTheme("light")
            }}/>  
            <p>Light</p>
          </div>
          <div className="flex items-center space-x-2" >
            <Checkbox checked={theme === "dark"} onCheckedChange={() => {
              setTheme("dark")
            }}/>  
            <p>Dark</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox checked={theme === "system"} onCheckedChange={() => {
              setTheme("system")
            }}/>  
            <p>System</p>
          </div>
        </div>
        <Select defaultValue={color} onValueChange={(e) => {
           setColor(e as Colors)
           localStorage.setItem("color", e)
        }}>
          <SelectTrigger className="w-[180px]" >
            <SelectValue placeholder="Color" />
          </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Colors</SelectLabel>
                <SelectItem value={Colors.green}>Green</SelectItem>
                <SelectItem value={Colors.yellow}>Yellow</SelectItem>
                <SelectItem value={Colors.blue}>Blue</SelectItem>
                <SelectItem value={Colors.red}>Red</SelectItem>
                <SelectItem value={Colors.purple}>Purple</SelectItem>
                <SelectItem value={Colors.orange}>Orange</SelectItem>
              </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
