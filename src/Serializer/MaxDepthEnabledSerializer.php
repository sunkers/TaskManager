<?php
namespace App\Serializer;

use Symfony\Component\Serializer\Serializer;
use App\Serializer\Normalizer\MaxDepthEnabledObjectNormalizer;

class MaxDepthEnabledSerializer extends Serializer
{
    public function __construct(MaxDepthEnabledObjectNormalizer $normalizer)
    {
        parent::__construct([$normalizer]);
    }
}
