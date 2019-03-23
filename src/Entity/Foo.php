<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FooRepository")
 */
class Foo
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $bar;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBar(): ?string
    {
        return $this->bar;
    }

    public function setBar(string $bar): self
    {
        $this->bar = $bar;

        return $this;
    }
}
