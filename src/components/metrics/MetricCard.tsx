import { Button, Column, Icon, Row, Text, Tooltip, TooltipTrigger } from '@umami/react-zen';
import type { ReactNode } from 'react';
import CountUp from '@/components/animate/count-up';
import { Info } from '@/components/icons';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import { formatNumber } from '@/lib/format';

export interface MetricCardProps {
  value: number;
  previousValue?: number;
  change?: number;
  label?: string;
  tooltip?: ReactNode;
  reverseColors?: boolean;
  formatValue?: (n: any) => string;
  showLabel?: boolean;
  showChange?: boolean;
}

export const MetricCard = ({
  value = 0,
  change = 0,
  label,
  tooltip,
  reverseColors = false,
  formatValue = formatNumber,
  showLabel = true,
  showChange = false,
}: MetricCardProps) => {
  const diff = value - change;
  const pct = diff !== 0 ? ((value - diff) / diff) * 100 : value !== 0 ? 100 : 0;
  const x = Number(value) || 0;
  const p = Number(pct) || 0;
  // Plain whole numbers roll like an odometer; durations and percentages keep Umami's own format.
  const isPlainNumber = formatValue === formatNumber;

  return (
    <Column
      justifyContent="center"
      paddingX="6"
      paddingY="4"
      borderRadius
      backgroundColor="surface"
      border
      gap="4"
    >
      {showLabel && (
        <Row justifyContent="space-between" alignItems="flex-start">
          <Text weight="bold" wrap="nowrap">
            {label}
          </Text>
          {tooltip && (
            <TooltipTrigger delay={0}>
              <Button size="sm" variant="quiet">
                <Icon size="sm">
                  <Info />
                </Icon>
              </Button>
              <Tooltip placement="top">{tooltip}</Tooltip>
            </TooltipTrigger>
          )}
        </Row>
      )}
      <Text size="4xl" weight="bold" wrap="nowrap">
        <span title={value?.toString()}>
          {isPlainNumber ? (
            <CountUp to={x} mode="roll" decimals={0} duration={1.2} easing="expo" />
          ) : (
            <CountUp to={x} formatter={formatValue} duration={1.2} easing="expo" />
          )}
        </span>
      </Text>
      {showChange && (
        <ChangeLabel value={change} title={formatValue(change)} reverseColors={reverseColors}>
          <CountUp to={Math.abs(Math.trunc(p))} suffix="%" decimals={0} duration={1.2} easing="expo" />
        </ChangeLabel>
      )}
    </Column>
  );
};
