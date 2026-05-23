"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Filter, RotateCcw, X } from "lucide-react"
import {
  activityStatuses,
  countActiveFilters,
  defaultPeopleFilters,
  departments,
  fellowships,
  joinDateRanges,
  memberTypes,
  statuses,
  type PeopleFilterState,
} from "@/lib/people-filters"

interface PeopleFiltersProps {
  filters: PeopleFilterState
  onFiltersChange: (filters: PeopleFilterState) => void
}

function FilterSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-accent">
        {label}
      </Label>
      {children}
    </div>
  )
}

function FilterSelect({
  value,
  onValueChange,
  options,
  disabled,
}: {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function PeopleFilters({ filters, onFiltersChange }: PeopleFiltersProps) {
  const activeCount = countActiveFilters(filters)
  const fellowshipDisabled = filters.inFellowship === false

  const update = (patch: Partial<PeopleFilterState>) => {
    onFiltersChange({ ...filters, ...patch })
  }

  const handleFellowshipChange = (value: string) => {
    const inFellowship = value === "yes" ? true : value === "no" ? false : null
    update({
      inFellowship,
      fellowship: inFellowship === false ? "all" : filters.fellowship,
    })
  }

  const toggleMemberType = (value: string, checked: boolean) => {
    update({
      memberType: checked
        ? [...filters.memberType, value]
        : filters.memberType.filter((item) => item !== value),
    })
  }

  const clearFilters = () => {
    onFiltersChange(defaultPeopleFilters)
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              Filters
            </CardTitle>
            {activeCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {activeCount}
              </Badge>
            )}
          </div>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pt-0">
        <FilterSection label="Status">
          <FilterSelect
            value={filters.status}
            onValueChange={(value) => update({ status: value })}
            options={statuses}
          />
        </FilterSection>

        <Separator />

        <FilterSection label="In Fellowship">
          <RadioGroup
            value={
              filters.inFellowship === true
                ? "yes"
                : filters.inFellowship === false
                  ? "no"
                  : ""
            }
            onValueChange={handleFellowshipChange}
            className="flex gap-2"
          >
            <div className="flex-1">
              <RadioGroupItem value="yes" id="fellowship-yes" className="peer sr-only" />
              <Label
                htmlFor="fellowship-yes"
                className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 text-sm font-medium cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
              >
                Yes
              </Label>
            </div>
            <div className="flex-1">
              <RadioGroupItem value="no" id="fellowship-no" className="peer sr-only" />
              <Label
                htmlFor="fellowship-no"
                className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 text-sm font-medium cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
              >
                No
              </Label>
            </div>
          </RadioGroup>
        </FilterSection>

        <FilterSection label="Fellowship">
          <FilterSelect
            value={filters.fellowship}
            onValueChange={(value) => update({ fellowship: value })}
            options={fellowships}
            disabled={fellowshipDisabled}
          />
          {fellowshipDisabled && (
            <p className="text-xs text-muted-foreground">
              Select &quot;Yes&quot; under In Fellowship to filter by group.
            </p>
          )}
        </FilterSection>

        <Separator />

        <FilterSection label="Department">
          <FilterSelect
            value={filters.department}
            onValueChange={(value) => update({ department: value })}
            options={departments}
          />
        </FilterSection>

        <FilterSection label="Member Type">
          <div className="space-y-2.5">
            {memberTypes.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2.5">
                <Checkbox
                  id={`member-type-${value}`}
                  checked={filters.memberType.includes(value)}
                  onCheckedChange={(checked) =>
                    toggleMemberType(value, checked === true)
                  }
                />
                <Label
                  htmlFor={`member-type-${value}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator />

        <FilterSection label="Activity Status">
          <FilterSelect
            value={filters.activityStatus}
            onValueChange={(value) => update({ activityStatus: value })}
            options={activityStatuses}
          />
        </FilterSection>

        <FilterSection label="Join Date Range">
          <FilterSelect
            value={filters.joinDateRange}
            onValueChange={(value) => update({ joinDateRange: value })}
            options={joinDateRanges}
          />
        </FilterSection>

        {activeCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Active filters</p>
              <div className="flex flex-wrap gap-1.5">
                {filters.status !== "all" && (
                  <Badge variant="outline" className="gap-1 pr-1 text-xs">
                    {filters.status}
                    <button
                      type="button"
                      onClick={() => update({ status: "all" })}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.inFellowship !== null && (
                  <Badge variant="outline" className="gap-1 pr-1 text-xs">
                    In fellowship: {filters.inFellowship ? "Yes" : "No"}
                    <button
                      type="button"
                      onClick={() => update({ inFellowship: null })}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.fellowship !== "all" && (
                  <Badge variant="outline" className="gap-1 pr-1 text-xs">
                    {filters.fellowship}
                    <button
                      type="button"
                      onClick={() => update({ fellowship: "all" })}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.department !== "all" && (
                  <Badge variant="outline" className="gap-1 pr-1 text-xs">
                    {filters.department}
                    <button
                      type="button"
                      onClick={() => update({ department: "all" })}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.memberType.map((value) => (
                  <Badge key={value} variant="outline" className="gap-1 pr-1 text-xs">
                    {value === "adult" ? "Adult" : "Child"}
                    <button
                      type="button"
                      onClick={() => toggleMemberType(value, false)}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {filters.activityStatus !== "all" && (
                  <Badge variant="outline" className="gap-1 pr-1 text-xs">
                    {filters.activityStatus === "active" ? "Active" : "Inactive"}
                    <button
                      type="button"
                      onClick={() => update({ activityStatus: "all" })}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.joinDateRange !== "all" && (
                  <Badge variant="outline" className="gap-1 pr-1 text-xs">
                    {joinDateRanges.find((range) => range.value === filters.joinDateRange)?.label}
                    <button
                      type="button"
                      onClick={() => update({ joinDateRange: "all" })}
                      className="rounded-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
